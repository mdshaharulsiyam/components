import { MdOutlineShowChart } from "react-icons/md"
const OverviewCard = ({ title, total, icon, text }) => {
    return (
        <div className="p-4 rounded-md bg-white card-shadow w-full">
            <div className='between-center gap-2 w-full '>
                <div className="w-16 h-16 p-4 rounded-full overflow-hidden card-shadow">
                    <img className="w-full h-full object-cover" src={icon} alt="" />
                </div>
                <div>
                    <p className="overview-title">{title}</p>
                    <p className="overview-total">{total}</p>
                </div>
            </div>
            <p className="start-center mt-4 gap-2"><MdOutlineShowChart className="text-2xl text-[#2492EB]"/> {text}</p>
        </div>
    )
}

export default OverviewCard
