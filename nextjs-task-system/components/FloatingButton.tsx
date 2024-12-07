interface FloatingButtonProps {
  onPress?: () => void;
}

export default function FloatingButton({ onPress }: FloatingButtonProps) {
  return (
    <div className="fixed bottom-8 right-8">
      <button
        onClick={onPress} // Aquí manejarás la acción de agregar tarea
        className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300"
      >
        <span className="text-2xl font-bold">+</span>
      </button>
    </div>
  );
}
