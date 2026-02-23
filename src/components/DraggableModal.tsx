import React, { useState, useRef, useEffect } from "react";

interface DraggableModalProps {
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
}

const DEFAULT_WIDTH = 960;
const DEFAULT_HEIGHT = 800;
const MARGIN = 40;

export default function DraggableModal({ title, onClose, children }: DraggableModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  const getResponsiveSize = () => {
    const maxWidth = window.innerWidth - MARGIN;
    const maxHeight = window.innerHeight - MARGIN;

    return {
      width: Math.min(DEFAULT_WIDTH, maxWidth),
      height: Math.min(DEFAULT_HEIGHT, maxHeight),
    };
  };

  const centerModal = (size: { width: number; height: number }) => ({
    x: (window.innerWidth - size.width) / 2,
    y: (window.innerHeight - size.height) / 2,
  });

  // 초기값 계산
  const [size, setSize] = useState(() => getResponsiveSize());
  const [position, setPosition] = useState(() => centerModal(getResponsiveSize()));

  const [isDragging, setIsDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleResize = () => {
      const newSize = getResponsiveSize();
      setSize(newSize);
      setPosition(centerModal(newSize));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    setPosition({
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      ref={modalRef}
      className="fixed bg-white shadow-2xl rounded-xl border"
      style={{
        width: size.width,
        height: size.height,
        top: position.y,
        left: position.x,
        zIndex: 1000,
      }}
    >
      <div className="flex justify-between items-center px-4 py-2 cursor-move rounded-t-xl" onMouseDown={handleMouseDown}>
        {title && <span className="font-semibold">{title}</span>}
        <button onClick={onClose} className="text-sm text-gray-500 hover:text-black ml-auto">
          ✕
        </button>
      </div>

      <div className="pb-6 px-2 overflow-auto h-[calc(100%-48px)]">{children}</div>
    </div>
  );
}
