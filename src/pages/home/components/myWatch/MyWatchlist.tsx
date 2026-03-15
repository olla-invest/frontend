interface Props {
  item: any;
  bookmarks: Record<number, boolean>;
  setBookmarks: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
}

export default function MyWatchlist({ item, bookmarks, setBookmarks }: Props) {
  return (
    <li className="py-1 flex items-center justify-between gap-1" key={item.id}>
      {item.type === "stock" ? (
        <div className="flex justify-between gap-4 flex-1">
          <div className="flex gap-2 items-center w-32 flex-1">
            <div className="size-8 rounded-full bg-[#D9D9D9] shrink-0" />
            <span className="truncate">{item.name}</span>
          </div>
          <div className="flex flex-col text-sm items-end py-1">
            <span className="text-slate-800 font-semibold">{item.current}원</span>
            <span className="text-xs text-rose-500">+2,500원 {item.currentChange}</span>
          </div>
        </div>
      ) : (
        <div className="flex justify-between gap-4 flex-1">
          <div className="flex gap-2 items-center w-32 flex-1">
            <div className="size-8 rounded-md bg-[#D9D9D9] shrink-0" />
            <span className="truncate">{item.name}</span>
          </div>
          <div className="flex gap-2 text-slate-700 text-sm items-center">
            <span>34개 중</span>
            <span>
              <span className="text-rose-500">28</span>
              상승
            </span>
          </div>
        </div>
      )}
      <button
        className="w-8 shrink-0"
        onClick={(e) => {
          e.stopPropagation();
          setBookmarks((prev) => ({
            ...prev,
            [item.id]: !prev[item.id],
          }));
        }}
      >
        <i className={`icon ${bookmarks[item.id] ? "icon-star-fill" : "icon-star"}`} />
      </button>
    </li>
  );
}
