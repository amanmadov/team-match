import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DndContext, useDraggable, useDroppable, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';

function PlayerToken({ name, team, number, isDragging }) {
  const bgColor = team === 'A' ? 'bg-blue-600' : 'bg-red-600';
  
  return (
    <div className={`flex flex-col items-center ${isDragging ? 'opacity-50' : ''}`}>
      <div className={`${bgColor} rounded-lg shadow-2xl relative w-14 h-16 flex items-center justify-center cursor-move`}>
        {/* Jersey shape */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-10 h-3 bg-inherit rounded-t-lg"></div>
        <div className="absolute top-2 left-0 w-3 h-4 bg-inherit rounded-tl-lg"></div>
        <div className="absolute top-2 right-0 w-3 h-4 bg-inherit rounded-tr-lg"></div>
        <span className="text-white font-black text-xl z-10">{number}</span>
      </div>
      <div className="mt-1 bg-black/70 px-2 py-0.5 rounded text-white text-xs font-semibold whitespace-nowrap pointer-events-none">
        {name}
      </div>
    </div>
  );
}

function DraggablePlayer({ player, team, number, position }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `${team}-${player.id}`,
    data: { player, team, number }
  });

  const style = {
    transform: transform 
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)` 
      : position 
        ? `translate3d(${position.x}px, ${position.y}px, 0)` 
        : undefined,
    zIndex: isDragging ? 1000 : 'auto',
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <PlayerToken name={player.name} team={team} number={number} isDragging={isDragging} />
    </div>
  );
}

function FieldDropZone({ team, children }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `field-${team}`,
    data: { team }
  });

  return (
    <div 
      ref={setNodeRef}
      className={`flex-1 relative ${isOver ? 'bg-white/5' : ''}`}
    >
      {children}
    </div>
  );
}

function Field({ lineup }) {
  const { teamA, teamB } = lineup;
  const [playerPositions, setPlayerPositions] = useState({});
  const [activePlayer, setActivePlayer] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragStart = (event) => {
    setActivePlayer(event.active.data.current);
  };

  const handleDragEnd = (event) => {
    const { active, over, delta } = event;
    
    if (over && over.data.current) {
      const draggedTeam = active.data.current.team;
      const dropTeam = over.data.current.team;
      
      // Only allow drop in same team's field
      if (draggedTeam === dropTeam) {
        const playerId = active.id;
        const currentPos = playerPositions[playerId] || { x: 0, y: 0 };
        
        setPlayerPositions(prev => ({
          ...prev,
          [playerId]: {
            x: currentPos.x + delta.x,
            y: currentPos.y + delta.y
          }
        }));
      }
    }
    
    setActivePlayer(null);
  };

  const handleDragCancel = () => {
    setActivePlayer(null);
  };

  // Distribute players into formation (4-3-3 or adapt based on player count)
  const getFormation = (players) => {
    const count = players.length;
    
    if (count <= 3) {
      return { gk: players.slice(0, 1), def: [], mid: [], fwd: players.slice(1) };
    } else if (count <= 5) {
      return { gk: players.slice(0, 1), def: players.slice(1, 3), mid: [], fwd: players.slice(3) };
    } else if (count <= 7) {
      return { gk: players.slice(0, 1), def: players.slice(1, 3), mid: players.slice(3, 5), fwd: players.slice(5) };
    } else if (count <= 9) {
      return { gk: players.slice(0, 1), def: players.slice(1, 4), mid: players.slice(4, 6), fwd: players.slice(6) };
    } else {
      // Full 4-3-3
      return { 
        gk: players.slice(0, 1), 
        def: players.slice(1, 5), 
        mid: players.slice(5, 8), 
        fwd: players.slice(8) 
      };
    }
  };

  const formationA = getFormation(teamA);
  const formationB = getFormation(teamB);

  return (
    <DndContext 
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="relative w-full h-[700px] bg-gradient-to-b from-[#4a7c59] via-[#3d6b4a] to-[#4a7c59] rounded-2xl shadow-2xl overflow-hidden border-4 border-white/90">
        {/* Horizontal stripe pattern */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(14)].map((_, i) => (
            <div key={i} className={`absolute left-0 right-0 h-[50px] ${i % 2 === 0 ? 'bg-[#3d6b4a]/30' : 'bg-transparent'}`} style={{ top: `${i * 50}px` }}></div>
          ))}
        </div>

        {/* Field markings */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Border */}
          <div className="absolute inset-4 border-2 border-white/90 rounded"></div>
          
          {/* Center line */}
          <div className="absolute left-1/2 top-4 bottom-4 w-0.5 bg-white/90 transform -translate-x-1/2"></div>
          
          {/* Center circle */}
          <div className="absolute left-1/2 top-1/2 w-32 h-32 border-2 border-white/90 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute left-1/2 top-1/2 w-2 h-2 bg-white/90 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          
          {/* Left goal and penalty area */}
          <div className="absolute left-4 top-1/2 w-16 h-2 bg-white/90 rounded transform -translate-y-1/2"></div>
          <div className="absolute left-4 top-1/2 w-0.5 h-12 bg-white/90 transform -translate-y-1/2"></div>
          <div className="absolute left-4 top-1/2 w-20 h-40 border-2 border-l-0 border-white/90 transform -translate-y-1/2"></div>
          <div className="absolute left-4 top-1/2 w-12 h-24 border-2 border-l-0 border-white/90 transform -translate-y-1/2"></div>
          <div className="absolute left-20 top-1/2 w-2 h-2 bg-white/90 rounded-full transform -translate-y-1/2"></div>
          
          {/* Right goal and penalty area */}
          <div className="absolute right-4 top-1/2 w-16 h-2 bg-white/90 rounded transform -translate-y-1/2"></div>
          <div className="absolute right-4 top-1/2 w-0.5 h-12 bg-white/90 transform -translate-y-1/2"></div>
          <div className="absolute right-4 top-1/2 w-20 h-40 border-2 border-r-0 border-white/90 transform -translate-y-1/2"></div>
          <div className="absolute right-4 top-1/2 w-12 h-24 border-2 border-r-0 border-white/90 transform -translate-y-1/2"></div>
          <div className="absolute right-20 top-1/2 w-2 h-2 bg-white/90 rounded-full transform -translate-y-1/2"></div>
          
          {/* Corner arcs */}
          <div className="absolute left-4 top-4 w-4 h-4 border-2 border-t-0 border-l-0 border-white/90 rounded-br-full"></div>
          <div className="absolute left-4 bottom-4 w-4 h-4 border-2 border-b-0 border-l-0 border-white/90 rounded-tr-full"></div>
          <div className="absolute right-4 top-4 w-4 h-4 border-2 border-t-0 border-r-0 border-white/90 rounded-bl-full"></div>
          <div className="absolute right-4 bottom-4 w-4 h-4 border-2 border-b-0 border-r-0 border-white/90 rounded-tl-full"></div>
        </div>

        {/* Teams */}
        <div className="relative z-10 h-full flex">
          {/* Team A - Left Side */}
          <FieldDropZone team="A">
            <div className="flex-1 flex flex-row justify-between py-8 px-8">
              <div className="absolute top-8 left-8">
                <div className="bg-blue-700/90 backdrop-blur-sm px-6 py-2 rounded-xl border-2 border-blue-400 shadow-lg">
                  <h3 className="text-xl font-black text-white uppercase tracking-wider">Team A</h3>
                </div>
              </div>
              
              {/* Goalkeeper */}
              <div className="flex flex-col justify-center">
                {formationA.gk.map((player, idx) => (
                  <DraggablePlayer 
                    key={player.id} 
                    player={player} 
                    team="A" 
                    number={1}
                    position={playerPositions[`A-${player.id}`]}
                  />
                ))}
              </div>
              
              {/* Defenders */}
              {formationA.def.length > 0 && (
                <div className="flex flex-col justify-center gap-6">
                  {formationA.def.map((player, idx) => (
                    <DraggablePlayer 
                      key={player.id} 
                      player={player} 
                      team="A" 
                      number={idx + 2}
                      position={playerPositions[`A-${player.id}`]}
                    />
                  ))}
                </div>
              )}
              
              {/* Midfielders */}
              {formationA.mid.length > 0 && (
                <div className="flex flex-col justify-center gap-8">
                  {formationA.mid.map((player, idx) => (
                    <DraggablePlayer 
                      key={player.id} 
                      player={player} 
                      team="A" 
                      number={idx + 2 + formationA.def.length}
                      position={playerPositions[`A-${player.id}`]}
                    />
                  ))}
                </div>
              )}
              
              {/* Forwards */}
              <div className="flex flex-col justify-center gap-8">
                {formationA.fwd.map((player, idx) => (
                  <DraggablePlayer 
                    key={player.id} 
                    player={player} 
                    team="A" 
                    number={idx + 2 + formationA.def.length + formationA.mid.length}
                    position={playerPositions[`A-${player.id}`]}
                  />
                ))}
              </div>
            </div>
          </FieldDropZone>

          {/* Team B - Right Side */}
          <FieldDropZone team="B">
            <div className="flex-1 flex flex-row-reverse justify-between py-8 px-8">
              <div className="absolute top-8 right-8">
                <div className="bg-red-700/90 backdrop-blur-sm px-6 py-2 rounded-xl border-2 border-red-400 shadow-lg">
                  <h3 className="text-xl font-black text-white uppercase tracking-wider">Team B</h3>
                </div>
              </div>
              
              {/* Goalkeeper */}
              <div className="flex flex-col justify-center">
                {formationB.gk.map((player, idx) => (
                  <DraggablePlayer 
                    key={player.id} 
                    player={player} 
                    team="B" 
                    number={1}
                    position={playerPositions[`B-${player.id}`]}
                  />
                ))}
              </div>
              
              {/* Defenders */}
              {formationB.def.length > 0 && (
                <div className="flex flex-col justify-center gap-6">
                  {formationB.def.map((player, idx) => (
                    <DraggablePlayer 
                      key={player.id} 
                      player={player} 
                      team="B" 
                      number={idx + 2}
                      position={playerPositions[`B-${player.id}`]}
                    />
                  ))}
                </div>
              )}
              
              {/* Midfielders */}
              {formationB.mid.length > 0 && (
                <div className="flex flex-col justify-center gap-8">
                  {formationB.mid.map((player, idx) => (
                    <DraggablePlayer 
                      key={player.id} 
                      player={player} 
                      team="B" 
                      number={idx + 2 + formationB.def.length}
                      position={playerPositions[`B-${player.id}`]}
                    />
                  ))}
                </div>
              )}
              
              {/* Forwards */}
              <div className="flex flex-col justify-center gap-8">
                {formationB.fwd.map((player, idx) => (
                  <DraggablePlayer 
                    key={player.id} 
                    player={player} 
                    team="B" 
                    number={idx + 2 + formationB.def.length + formationB.mid.length}
                    position={playerPositions[`B-${player.id}`]}
                  />
                ))}
              </div>
            </div>
          </FieldDropZone>
        </div>
      </div>
    </DndContext>
  );
}

export default function SoccerField({ variations }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!variations || variations.length === 0) {
    return (
      <div className="bg-uefa-blue-light/80 backdrop-blur-sm rounded-xl p-10 shadow-2xl border border-uefa-cyan/20">
        <p className="text-gray-300 text-center text-lg">
          No lineups generated yet. Add players and click "Generate Lineups" to see the results.
        </p>
      </div>
    );
  }

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : variations.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < variations.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="bg-uefa-blue-light/80 backdrop-blur-sm rounded-xl p-7 shadow-2xl border border-uefa-cyan/20">
      <div className="flex items-center justify-between mb-7">
        <h2 className="text-3xl font-bold text-white uppercase tracking-wide">
          Team Lineups
        </h2>
        <div className="flex items-center gap-5">
          <button
            onClick={handlePrevious}
            className="p-3 bg-uefa-blue-dark hover:bg-uefa-cyan hover:text-uefa-blue-dark text-white rounded-lg transition-all shadow-lg"
            aria-label="Previous lineup"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <span className="text-white font-bold text-xl min-w-[120px] text-center">
            Option {currentIndex + 1} / {variations.length}
          </span>
          <button
            onClick={handleNext}
            className="p-3 bg-uefa-blue-dark hover:bg-uefa-cyan hover:text-uefa-blue-dark text-white rounded-lg transition-all shadow-lg"
            aria-label="Next lineup"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Tabs for quick navigation */}
      <div className="flex gap-3 mb-7 overflow-x-auto pb-2">
        {variations.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`px-6 py-3 rounded-lg font-bold transition-all whitespace-nowrap shadow-lg ${
              idx === currentIndex
                ? 'bg-uefa-cyan text-uefa-blue-dark scale-105'
                : 'bg-uefa-blue-dark text-gray-300 hover:bg-uefa-blue-dark/70'
            }`}
          >
            Option {idx + 1}
          </button>
        ))}
      </div>

      <Field lineup={variations[currentIndex]} />
    </div>
  );
}
