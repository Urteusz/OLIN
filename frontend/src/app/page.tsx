export default function DashboardPage() {
  // Przykładowe dane statystyk
  const stats = [
    { name: 'Aktywni użytkownicy', value: '2,345', change: '+12%', changeType: 'increase' },
    { name: 'Nowi użytkownicy (30d)', value: '156', change: '+8%', changeType: 'increase' },
    { name: 'Średni czas sesji', value: '4m 32s', change: '-2%', changeType: 'decrease' },
    { name: 'Wydajność systemu', value: '98.7%', change: '+0.5%', changeType: 'increase' },
  ];

  // Przykładowe ostatnie aktywności
  const recentActivities = [
    { id: 1, user: 'Jan Kowalski', action: 'Zalogował się', time: '2 min temu', icon: '🔑' },
    { id: 2, user: 'Anna Nowak', action: 'Zaktualizował profil', time: '15 min temu', icon: '✏️' },
    { id: 3, user: 'Piotr Wiśniewski', action: 'Dodał nowy dokument', time: '1 godz. temu', icon: '📄' },
    { id: 4, user: 'System', action: 'Zakończono kopię zapasową', time: '2 godz. temu', icon: '💾' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Podsumowanie</h2>
      
      {/* Karty ze statystykami */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">{stat.name}</p>
              <span className={`px-2 py-1 text-xs rounded-full ${
                stat.changeType === 'increase' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {stat.change}
              </span>
            </div>
            <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Ostatnie aktywności */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Ostatnie aktywności</h3>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <span className="text-xl mr-3">{activity.icon}</span>
              <div className="flex-1">
                <p className="font-medium">{activity.user}</p>
                <p className="text-sm text-gray-500">{activity.action}</p>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Szybkie akcje */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Szybkie akcje</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <div className="text-2xl mb-2">➕</div>
            <p className="font-medium">Nowy użytkownik</p>
            <p className="text-sm text-gray-500">Dodaj nowego użytkownika do systemu</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <div className="text-2xl mb-2">📊</div>
            <p className="font-medium">Raporty</p>
            <p className="text-sm text-gray-500">Wygeneruj raporty systemowe</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <div className="text-2xl mb-2">⚙️</div>
            <p className="font-medium">Ustawienia</p>
            <p className="text-sm text-gray-500">Dostosuj ustawienia systemu</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <div className="text-2xl mb-2">❓</div>
            <p className="font-medium">Pomoc</p>
            <p className="text-sm text-gray-500">Uzyskaj pomoc i wsparcie</p>
          </button>
        </div>
      </div>
    </div>
  );
}
