

export default function HomePage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
            <div className="w-full max-w-4xl rounded-xl bg-white p-10 text-center shadow-lg">
                <h1 className="mb-4 text-4xl font-semibold text-gray-800">Welcome to Our Website</h1>
                <p className="mb-6 text-lg text-gray-600">This is the home page. Discover amazing content and features!</p>
                <p className="text-lg text-gray-600">Created by Joshua Granados Loría.</p>
                <p className="text-lg text-gray-600">Email: joshua.granados.loria@gmail.com.</p>
                <h1 className="mb-4 text-4xl font-semibold text-gray-800">Note: Sometimes you have to reload the page to display the entire menu.</h1>
            </div>
        </div>
    );
}

