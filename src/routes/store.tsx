import { createFileRoute } from '@tanstack/react-router'
import { useSave } from '#/context/SaveDataContext'
import { items } from '#/data'
import { getUnlockedSlots, type ItemSlot } from '#/types'

export const Route = createFileRoute('/store')({ component: StorePage })

const SLOT_LABELS: Record<ItemSlot, string> = {
  head: '頭部パーツ',
  body: 'ボディパーツ',
  arm: 'アームパーツ',
  back: 'バックパーツ',
  effect: 'エフェクト',
}

const ALL_SLOTS: ItemSlot[] = ['head', 'body', 'arm', 'back', 'effect']

function StorePage() {
  const { data, avatarLevel, buyItem } = useSave()
  const unlockedSlots = getUnlockedSlots(avatarLevel)

  return (
    <main className="page-shell">
      <section className="hero-panel" style={{ gridTemplateColumns: '1fr' }}>
        <div className="hero-copy">
          <p className="eyebrow">Item Store</p>
          <h1>アイテムストア</h1>
          <p className="hero-text">
            ポイントを使ってアバターのアイテムを購入しよう。
            所持ポイント: {data.player.currentPoints} pt
          </p>
        </div>
      </section>

      {ALL_SLOTS.map((slot) => {
        const slotItems = items.filter((i) => i.slot === slot)
        const isUnlocked = unlockedSlots.includes(slot)

        return (
          <section key={slot} className="table-panel">
            <div className="table-header">
              <div>
                <p className="eyebrow">{SLOT_LABELS[slot]}</p>
                <h2>
                  {SLOT_LABELS[slot]}
                  {!isUnlocked && ' 🔒'}
                </h2>
              </div>
              {!isUnlocked && (
                <p className="table-meta">
                  アバターLv.{ALL_SLOTS.indexOf(slot) + 1}で解放
                </p>
              )}
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 200px), 1fr))',
                gap: 12,
              }}
            >
              {slotItems.map((item) => {
                const owned = data.player.ownedItems.includes(item.id)
                const canBuy =
                  isUnlocked &&
                  !owned &&
                  data.player.currentPoints >= item.price

                return (
                  <div
                    key={item.id}
                    style={{
                      padding: 16,
                      border: '1px solid var(--line)',
                      borderRadius: 16,
                      background: owned
                        ? '#d4edda'
                        : 'rgba(255,255,255,0.82)',
                      opacity: isUnlocked ? 1 : 0.5,
                    }}
                  >
                    <strong>{item.name}</strong>
                    <p
                      style={{
                        fontSize: '0.85rem',
                        color: 'var(--muted)',
                        margin: '4px 0 8px',
                      }}
                    >
                      {item.description}
                    </p>
                    {owned ? (
                      <span
                        style={{
                          fontSize: '0.85rem',
                          color: 'var(--word-css)',
                          fontWeight: 700,
                        }}
                      >
                        購入済み
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="primary-link"
                        disabled={!canBuy}
                        onClick={() => buyItem(item.id, item.price)}
                        style={{
                          fontSize: '0.85rem',
                          opacity: canBuy ? 1 : 0.5,
                          cursor: canBuy ? 'pointer' : 'not-allowed',
                        }}
                      >
                        {item.price} pt で購入
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        )
      })}
    </main>
  )
}
