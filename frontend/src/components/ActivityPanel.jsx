const activities = [
  {
    title: "NDA Agreement generated",
    time: "2 minutes ago",
  },
  {
    title: "Employment contract exported",
    time: "18 minutes ago",
  },
  {
    title: "Legal document uploaded",
    time: "45 minutes ago",
  },
  {
    title: "Service agreement reviewed",
    time: "1 hour ago",
  },
];

function ActivityPanel() {

  return (

    <div className="card p-7">

      <div className="flex items-center justify-between mb-8">

        <div>

          <h3 className="text-lg font-semibold">
            Recent Activity
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            Latest legal operations
          </p>

        </div>

      </div>

      <div className="space-y-7">

        {activities.map((activity, index) => (

          <div
            key={index}
            className="flex gap-4"
          >

            <div className="mt-2 w-2 h-2 rounded-full bg-[#4f8cff]" />

            <div>

              <p className="text-sm font-medium">
                {activity.title}
              </p>

              <p className="text-xs text-slate-500 mt-1">
                {activity.time}
              </p>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

export default ActivityPanel;