import { useState } from 'react';
import { UserIcon, CalendarIcon, ClockIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

const TEAM_MEMBERS = [
  {
    id: 1,
    name: 'Jean Mbeng',
    role: 'Technicien',
    formation: 'École des cadres d\'Oyem',
    secteur: 'Secteur A - Maraîchage',
    status: 'active',
    phone: '+241 06 12 34 56',
    email: 'jean.mbeng@safem.ga',
    joinDate: '2023-01-15',
    productivity: 92
  },
  {
    id: 2,
    name: 'Marie Nze',
    role: 'Technicien',
    formation: 'École des cadres d\'Oyem',
    secteur: 'Secteur B - Maraîchage',
    status: 'active',
    phone: '+241 06 23 45 67',
    email: 'marie.nze@safem.ga',
    joinDate: '2023-02-01',
    productivity: 88
  },
  {
    id: 3,
    name: 'Paul Obiang',
    role: 'Technicien',
    formation: 'École des cadres d\'Oyem',
    secteur: 'Secteur C - Vivriers',
    status: 'break',
    phone: '+241 06 34 56 78',
    email: 'paul.obiang@safem.ga',
    joinDate: '2023-01-20',
    productivity: 85
  },
  {
    id: 4,
    name: 'Sophie Ndong',
    role: 'Technicien',
    formation: 'École des cadres d\'Oyem',
    secteur: 'Serre 1',
    status: 'active',
    phone: '+241 06 45 67 89',
    email: 'sophie.ndong@safem.ga',
    joinDate: '2023-03-10',
    productivity: 90
  },
  {
    id: 5,
    name: 'Pierre Essono',
    role: 'Technicien',
    formation: 'École des cadres d\'Oyem',
    secteur: 'Serre 2',
    status: 'active',
    phone: '+241 06 56 78 90',
    email: 'pierre.essono@safem.ga',
    joinDate: '2023-02-15',
    productivity: 87
  },
  {
    id: 6,
    name: 'Thomas Mba',
    role: 'Spécialiste Banane',
    formation: 'PNUD',
    secteur: 'Secteur D - Bananeraie',
    status: 'active',
    phone: '+241 06 67 89 01',
    email: 'thomas.mba@safem.ga',
    joinDate: '2023-01-10',
    productivity: 95
  },
  {
    id: 7,
    name: 'André Mintsa',
    role: 'Ouvrier Agricole',
    formation: 'Formation interne',
    secteur: 'Support général',
    status: 'active',
    phone: '+241 06 78 90 12',
    email: 'andre.mintsa@safem.ga',
    joinDate: '2023-04-01',
    productivity: 82
  },
  {
    id: 8,
    name: 'Sylvie Ondo',
    role: 'Ouvrier Agricole',
    formation: 'Formation interne',
    secteur: 'Support général',
    status: 'active',
    phone: '+241 06 89 01 23',
    email: 'sylvie.ondo@safem.ga',
    joinDate: '2023-04-15',
    productivity: 80
  }
];

const TASKS = [
  { id: 1, title: 'Récolte poivrons - Secteur A', assignee: 'Jean Mbeng', status: 'en-cours', priority: 'high', dueDate: '2024-01-16' },
  { id: 2, title: 'Arrosage tomates - Secteur B', assignee: 'Marie Nze', status: 'termine', priority: 'medium', dueDate: '2024-01-15' },
  { id: 3, title: 'Contrôle qualité bananes', assignee: 'Thomas Mba', status: 'en-cours', priority: 'high', dueDate: '2024-01-16' },
  { id: 4, title: 'Maintenance serre 1', assignee: 'Sophie Ndong', status: 'planifie', priority: 'low', dueDate: '2024-01-17' },
  { id: 5, title: 'Formation nouveaux ouvriers', assignee: 'Pierre Essono', status: 'planifie', priority: 'medium', dueDate: '2024-01-18' }
];

export default function TeamModule() {
  const [activeTab, setActiveTab] = useState('equipe');
  const [selectedMember, setSelectedMember] = useState(null);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    assignee: '',
    priority: 'medium',
    dueDate: new Date().toISOString().split('T')[0],
    description: ''
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'break': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'break': return 'Pause';
      case 'inactive': return 'Inactif';
      default: return 'Inconnu';
    }
  };

  const getTaskStatusColor = (status) => {
    switch (status) {
      case 'termine': return 'bg-green-100 text-green-800';
      case 'en-cours': return 'bg-blue-100 text-blue-800';
      case 'planifie': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    // Logique d'ajout de tâche
    console.log('Nouvelle tâche:', newTask);
    setShowAddTask(false);
    setNewTask({
      title: '',
      assignee: '',
      priority: 'medium',
      dueDate: new Date().toISOString().split('T')[0],
      description: ''
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestion d'Équipe</h1>
        <p className="text-gray-600">Suivi des membres de l'équipe et planification des tâches</p>
      </div>

      {/* Onglets */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('equipe')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'equipe'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Équipe
          </button>
          <button
            onClick={() => setActiveTab('taches')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'taches'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Tâches
          </button>
          <button
            onClick={() => setActiveTab('planning')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'planning'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Planning
          </button>
          <button
            onClick={() => setActiveTab('formation')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'formation'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Formation
          </button>
        </nav>
      </div>

      {/* Vue Équipe */}
      {activeTab === 'equipe' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Liste des membres */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Membres de l'équipe ({TEAM_MEMBERS.length})
                </h3>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {TEAM_MEMBERS.map((member) => (
                    <div
                      key={member.id}
                      onClick={() => setSelectedMember(member)}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">{member.name}</h4>
                            <p className="text-xs text-gray-500">{member.role}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(member.status)}`}>
                          {getStatusText(member.status)}
                        </span>
                      </div>
                      
                      <div className="mt-3">
                        <div className="text-xs text-gray-600 mb-1">{member.secteur}</div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Productivité</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-gray-200 rounded-full h-1">
                              <div 
                                className="bg-indigo-600 h-1 rounded-full" 
                                style={{ width: `${member.productivity}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium text-gray-900">{member.productivity}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Détails du membre sélectionné */}
          <div className="lg:col-span-1">
            {selectedMember ? (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-medium text-lg">
                      {selectedMember.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">{selectedMember.name}</h3>
                  <p className="text-sm text-gray-500">{selectedMember.role}</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Formation</label>
                    <p className="text-sm text-gray-900">{selectedMember.formation}</p>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Secteur</label>
                    <p className="text-sm text-gray-900">{selectedMember.secteur}</p>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Contact</label>
                    <p className="text-sm text-gray-900">{selectedMember.phone}</p>
                    <p className="text-sm text-gray-900">{selectedMember.email}</p>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Date d'embauche</label>
                    <p className="text-sm text-gray-900">
                      {new Date(selectedMember.joinDate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Productivité</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full" 
                          style={{ width: `${selectedMember.productivity}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{selectedMember.productivity}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                <UserIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Sélectionnez un membre de l'équipe pour voir ses détails</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Vue Tâches */}
      {activeTab === 'taches' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Gestion des Tâches</h3>
            <button
              onClick={() => setShowAddTask(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Nouvelle Tâche
            </button>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="space-y-4">
                {TASKS.map((task) => (
                  <div key={task.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">{task.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">Assigné à: {task.assignee}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${getTaskStatusColor(task.status)}`}>
                            {task.status.replace('-', ' ')}
                          </span>
                          <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                            Priorité {task.priority}
                          </span>
                          <span className="text-xs text-gray-500">
                            Échéance: {new Date(task.dueDate).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Modal Nouvelle Tâche */}
          {showAddTask && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Nouvelle Tâche</h3>
                <form onSubmit={handleAddTask} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                    <input
                      type="text"
                      value={newTask.title}
                      onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assigné à</label>
                    <select
                      value={newTask.assignee}
                      onChange={(e) => setNewTask(prev => ({ ...prev, assignee: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Sélectionner</option>
                      {TEAM_MEMBERS.map(member => (
                        <option key={member.id} value={member.name}>{member.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Priorité</label>
                      <select
                        value={newTask.priority}
                        onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="low">Faible</option>
                        <option value="medium">Moyenne</option>
                        <option value="high">Élevée</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Échéance</label>
                      <input
                        type="date"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowAddTask(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      Créer
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Vue Planning */}
      {activeTab === 'planning' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Planning Hebdomadaire</h3>
          <div className="text-center py-12 text-gray-500">
            <CalendarIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Calendrier de planning - À implémenter</p>
          </div>
        </div>
      )}

      {/* Vue Formation */}
      {activeTab === 'formation' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Programme de Formation</h3>
          <div className="text-center py-12 text-gray-500">
            <AcademicCapIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Module de formation continue - À implémenter</p>
          </div>
        </div>
      )}
    </div>
  );
}
