import Layout from '@theme/Layout';
import MockupFlowCanvas from '@site/src/components/MockupFlowCanvas';

export default function Page() {
  return (
    <Layout title="Preventiva · canvas" noFooter>
      <MockupFlowCanvas flow="/mockups/truck/preventiva/flow.json" status="Versão anterior" />
    </Layout>
  );
}
