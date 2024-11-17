const SponsorshipPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800">Choose a Child to Sponsor</h3>
      <div className="flex flex-wrap gap-4">
        {/* Here, you can map through the children to display them dynamically */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-md w-full sm:w-1/2 md:w-1/3">
          <h4 className="text-lg font-bold">John Doe</h4>
          <p className="text-gray-600">Age: 8</p>
          <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
            Sponsor Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default SponsorshipPage;
