import { createFileRoute } from '@tanstack/react-router'
import { useSave } from '#/context/SaveDataContext'
import { items, robots } from '#/data'
import { getUnlockedSlots, type ItemSlot } from '#/types'

export const Route = createFileRoute('/avatar')({ component: AvatarPage })

const SLOT_LABELS: Record<ItemSlot, string> = {
  head: '頭部パーツ',
  body: 'ボディパーツ',
  arm: 'アームパーツ',
  back: 'バックパーツ',
  effect: 'エフェクト',
}

function AvatarPage() {
  const {
    data,
    avatarLevel,
    equipItem,
    unequipItem,
    selectRobot,
  } = useSave()

  const unlockedSlots = getUnlockedSlots(avatarLevel)
  const currentRobot = robots.find((r) => r.id === data.player.robotId)

  return (
    <main className="page-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">Avatar</p>
          <h1>アバター</h1>
          <p className="hero-text">
            レベル: {avatarLevel} ・ ロボット: {currentRobot?.name}
          </p>
        </div>
        <div className="hero-stats">
          <div
            className="stat-card stat-card-accent"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem',
              minHeight: 160,
            }}
          >
            🤖
          </div>
        </div>
      </section>

      {/* ロボット選択 */}
      <section className="table-panel">
        <div className="table-header">
          <div>
            <p className="eyebrow">Robot Type</p>
            <h2>ロボットを選ぶ</h2>
          </div>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 160px), 1fr))',
            gap: 12,
          }}
        >
          {robots.map((robot) => {
            const isSelected = data.player.robotId === robot.id
            return (
              <button
                key={robot.id}
                type="button"
                onClick={() => selectRobot(robot.id)}
                style={{
                  padding: 16,
                  border: isSelected
                    ? '2px solid var(--accent)'
                    : '1px solid var(--line)',
                  borderRadius: 16,
                  background: isSelected
                    ? 'var(--accent-soft)'
                    : 'rgba(255,255,255,0.82)',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: 8 }}>🤖</div>
                <strong>{robot.name}</strong>
                <p
                  style={{
                    fontSize: '0.82rem',
                    color: 'var(--muted)',
                    margin: '4px 0 0',
                  }}
                >
                  {robot.description}
                </p>
              </button>
            )
          })}
        </div>
      </section>

      {/* スロット別装備 */}
      {unlockedSlots.map((slot) => {
        const ownedItems = items.filter(
          (i) => i.slot === slot && data.player.ownedItems.includes(i.id),
        )
        const equipped = data.player.equippedItems[slot]

        return (
          <section key={slot} className="table-panel">
            <div className="table-header">
              <div>
                <p className="eyebrow">{SLOT_LABELS[slot]}</p>
                <h2>{SLOT_LABELS[slot]}</h2>
              </div>
              {equipped && (
                <button
                  type="button"
                  className="ghost-link"
                  onClick={() => unequipItem(slot)}
                  style={{ fontSize: '0.85rem' }}
                >
                  外す
                </button>
              )}
            </div>

            {ownedItems.length === 0 ? (
              <p style={{ color: 'var(--muted)', fontSize: '0.92rem' }}>
                このスロットのアイテムを持っていません。ストアで購入しよう！
              </p>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                  gap: 10,
                }}
              >
                {ownedItems.map((item) => {
                  const isEquipped = equipped === item.id
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => equipItem(slot, item.id)}
                      style={{
                        padding: 14,
                        border: isEquipped
                          ? '2px solid var(--accent)'
                          : '1px solid var(--line)',
                        borderRadius: 14,
                        background: isEquipped
                          ? 'var(--accent-soft)'
                          : 'rgba(255,255,255,0.82)',
                        cursor: 'pointer',
                        textAlign: 'center',
                      }}
                    >
                      <strong>{item.name}</strong>
                      {isEquipped && (
                        <p
                          style={{
                            fontSize: '0.78rem',
                            color: 'var(--accent)',
                            margin: '4px 0 0',
                          }}
                        >
                          装備中
                        </p>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </section>
        )
      })}
    </main>
  )
}
