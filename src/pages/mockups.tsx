import Layout from '@theme/Layout';
import MockupCanvas from '@site/src/components/MockupCanvas';

export default function MockupsPage() {
  return (
    <Layout title="Mockups" description="Todos os mockups do ecossistema Facter num quadro só." noFooter>
      <MockupCanvas />
    </Layout>
  );
}
