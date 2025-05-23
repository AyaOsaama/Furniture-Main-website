<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
  {tags.map((tag, index) => (
    <div
      key={index}
      className="card bg-white shadow hover:shadow-lg transition cursor-pointer"
      onClick={() => handleNavigate(tag.name)}
    >
      <div className="card-body text-center">
        <h2 className="text-xl font-bold capitalize">{tag.name}</h2>
        <p className="text-gray-500">Shop now</p>
      </div>
    </div>
  ))}
</div>
