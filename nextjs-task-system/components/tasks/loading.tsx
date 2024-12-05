export default function Loading() {
    return (
        <div className="p-4">
            <div className="mb-4 flex justify-between items-center bg-gray-100 p-3 rounded shadow-md">
                <div className="flex gap-4">
                    <div className="bg-gray-300 w-24 h-6 rounded"></div>
                    <div className="bg-gray-300 w-24 h-6 rounded"></div>
                </div>
                <div className="flex gap-4">
                    <div className="bg-gray-300 w-32 h-6 rounded"></div>
                    <div className="bg-gray-300 w-32 h-6 rounded"></div>
                </div>
            </div>

            <div className="space-y-4">

                <div className="flex gap-4">
                    <div className="w-full bg-gray-200 h-16 rounded"></div>
                    <div className="w-full bg-gray-200 h-16 rounded"></div>
                </div>

     
                <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                        <div className="bg-gray-300 w-48 h-6 rounded"></div>
                        <div className="bg-gray-300 w-32 h-6 rounded"></div>
                        <div className="bg-gray-300 w-32 h-6 rounded"></div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="bg-gray-300 w-48 h-6 rounded"></div>
                        <div className="bg-gray-300 w-32 h-6 rounded"></div>
                        <div className="bg-gray-300 w-32 h-6 rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}