'use client';

interface HistoryEntry {
  id: string;
  playerName: string;
  prize: string;
  prizeEmoji: string;
  prizeColor: string;
  timestamp: number;
}

interface HistoryDisplayProps {
  history: HistoryEntry[];
  onPlayAgain: () => void;
  onAddNewPlayer: () => void;
}

export function HistoryDisplay({
  history,
  onPlayAgain,
  onAddNewPlayer,
}: HistoryDisplayProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-secondary/10 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              🎉 Selamat!
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Hadiah Anda telah ditentukan
          </p>
        </div>

        {/* Results */}
        <div className="flex justify-center">
          <div className="w-full max-w-2xl space-y-4">
            {history.map((entry, index) => (
              <div
                key={entry.id}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border-l-4"
                style={{ borderColor: entry.prizeColor }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{entry.prizeEmoji}</span>
                      <div>
                        <p className="font-bold text-2xl text-foreground">
                          {entry.playerName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Peserta #{index + 1}
                        </p>
                      </div>
                    </div>
                    <p className="text-lg font-semibold" style={{ color: entry.prizeColor }}>
                      {entry.prize}
                    </p>
                  </div>
                  <div
                    className="w-20 h-20 rounded-lg flex items-center justify-center text-4xl"
                    style={{ backgroundColor: entry.prizeColor + '20' }}
                  >
                    {entry.prizeEmoji}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-12">
          <button
            onClick={onPlayAgain}
            className="px-8 py-4 bg-gradient-to-r from-primary to-red-600 text-white rounded-lg font-bold text-lg hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            Putar Lagi
          </button>
          <button
            onClick={onAddNewPlayer}
            className="px-8 py-4 bg-secondary text-white rounded-lg font-bold text-lg hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            Peserta Baru
          </button>
        </div>

        {/* History Summary */}
        {history.length > 1 && (
          <div className="mt-12 flex justify-center">
            <div className="w-full max-w-2xl bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
                Riwayat Hari Ini
              </h2>
              <div className="space-y-3">
                {history.map((entry, index) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border-l-4"
                    style={{ borderColor: entry.prizeColor }}
                  >
                    <span className="font-semibold text-foreground">
                      {index + 1}. {entry.playerName}
                    </span>
                    <span className="text-sm font-bold" style={{ color: entry.prizeColor }}>
                      {entry.prizeEmoji} {entry.prize}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
