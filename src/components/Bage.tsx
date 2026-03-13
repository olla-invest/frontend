interface BageProps {
  content: string;
}
export function Bage({ content }: BageProps) {
  return (
    <div className="py-1 px-2.5 rounded-full border">
      <span className="text-slate-700 text-sm">{content}</span>
    </div>
  );
}
