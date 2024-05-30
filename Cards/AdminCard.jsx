const AdminCard = ({item,handelEdit}) => {
  const {profile, name, dept, designation,_id}=item
  return (
    <div className="w-full h-full p-6 bg-white card-shadow rounded center-center gap-2 flex-col px-8">
      <div className="h-24 w-24 rounded-full overflow-hidden">
        <img src={profile} className="w-full  h-full object-cover" alt="" />
      </div>
      <p>{name}</p>
      <p>{dept}</p>
      <p className="text-[#5C5C5C] font-light text-xs">{designation}</p>
      <div className="between-center gap-16 mt-5">
        <button onClick={()=>handelEdit(_id)} className="btn-primary ">Edit</button>
        <button className="btn-secondary ">Delete</button>
      </div>
    </div>
  )
}

export default AdminCard
