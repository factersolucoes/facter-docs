import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';

interface MockupScreenProps {
  title: string;
  status: string;
  file: string;
  /** Galeria do projeto, para o link "Mockups" (padrão: a do Truck). */
  gallery?: string;
}

export default function MockupScreen({ title, status, file, gallery = '/docs/truck/produto/mockups' }: MockupScreenProps) {
  const src = useBaseUrl(file);
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
          <Link to={gallery}>Mockups</Link>
          <strong>{title}</strong>
          <span style={{ color: 'var(--ifm-color-emphasis-700)' }}>{status}</span>
          <a href={src} target="_blank" rel="noreferrer" style={{ marginLeft: 'auto' }}>
            Abrir em outra aba
          </a>
        </div>
        <iframe src={src} title={title} style={{ flex: 1, width: '100%', border: 0 }} />
      </div>
    </Layout>
  );
}
