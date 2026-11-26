import Layout from '@theme/Layout';
import MockupFlowCanvas from '@site/src/components/MockupFlowCanvas';

export default function Page() {
  return (
    <Layout title="Agenda da preventiva · canvas" noFooter>
      <MockupFlowCanvas flow="/mockups/truck/preventiva-agenda/flow.json" status="Em revisão · 26/11/2026" />
    </Layout>
  );
}
