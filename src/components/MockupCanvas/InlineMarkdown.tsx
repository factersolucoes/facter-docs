import Link from '@docusaurus/Link';
import type {ReactNode} from 'react';

const TOKEN = /\*\*([^*]+)\*\*|`([^`]+)`|\[([^\]]+)\]\(([^)\s]+)\)|(?<![*\w])\*([^*]+)\*(?!\*)|"([^"]+)"/g;

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(TOKEN)) {
    const index = match.index ?? 0;
    if (index > last) nodes.push(text.slice(last, index));
    const key = `${index}`;
    if (match[1] !== undefined) nodes.push(<strong key={key}>{renderInline(match[1])}</strong>);
    else if (match[2] !== undefined) nodes.push(<code key={key}>{match[2]}</code>);
    else if (match[3] !== undefined && match[4] !== undefined) {
      nodes.push(
        <Link key={key} to={match[4]}>
          {renderInline(match[3])}
        </Link>,
      );
    } else if (match[5] !== undefined) nodes.push(<em key={key}>{match[5]}</em>);
    else if (match[6] !== undefined) nodes.push(`“${match[6]}”`);
    last = index + match[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export default function InlineMarkdown({source}: {source: string}) {
  return (
    <>
      {source.split(/\n\s*\n/).map((paragraph, index) => (
        <p key={index}>{renderInline(paragraph.replace(/\s*\n\s*/g, ' '))}</p>
      ))}
    </>
  );
}
