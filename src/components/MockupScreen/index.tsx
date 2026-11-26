import Link from '@docusaurus/Link';
import {useLocation} from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import {useEffect, useState} from 'react';
import {MockupModeToggle} from '@site/src/components/MockupFlowCanvas';
import {isFlowManifest} from '@site/src/components/MockupFlowCanvas/layout';

interface MockupScreenProps {
  title: string;
  status: string;
  file: string;
}

export default function MockupScreen({ title, status, file }: MockupScreenProps) {
  const src = useBaseUrl(file);
  const {pathname} = useLocation();
  const [, product = 'truck', slug = ''] = /^\/telas\/([^/]+)\/([^/]+)/.exec(pathname) ?? [];
  const flowUrl = src.replace(/\/[^/]*$/, '/flow.json');
  const [hasFlow, setHasFlow] = useState(false);
  useEffect(() => {
    let cancelled = false;
    fetch(flowUrl)
      .then((response) => (response.ok ? response.json() : null))
      .then((data: unknown) => {
        if (!cancelled) setHasFlow(isFlowManifest(data));
      })
      .catch(() => {
        if (!cancelled) setHasFlow(false);
      });
    return () => {
      cancelled = true;
    };
  }, [flowUrl]);
  return (
    <Layout title={title} noFooter>
      <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - var(--ifm-navbar-height))' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '8px 16px',
            borderBottom: '1px solid var(--ifm-color-emphasis-200)',
            fontSize: 14,
          }}
        >
          <Link to={`/mockups?p=${product}&f=${slug}`}>Mockups</Link>
          <strong>{title}</strong>
          <span style={{ color: 'var(--ifm-color-emphasis-700)' }}>{status}</span>
          {hasFlow && (
            <span style={{ marginLeft: 'auto' }}>
              <MockupModeToggle canvas={`${pathname.replace(/\/$/, '')}/canvas`} document={pathname} />
            </span>
          )}
          <a href={src} target="_blank" rel="noreferrer" style={{ marginLeft: hasFlow ? 0 : 'auto' }}>
            Abrir em outra aba
          </a>
        </div>
        <iframe src={src} title={title} style={{ flex: 1, width: '100%', border: 0 }} />
      </div>
    </Layout>
  );
}
