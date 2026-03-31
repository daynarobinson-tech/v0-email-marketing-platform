"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { DemoRedemptionOption, DemoSenderConfig } from "@/hooks/use-demo-sender-config"
import { Coins, Plus, RotateCcw, Trash2 } from "lucide-react"

interface SenderProgramSettingsProps {
  config: DemoSenderConfig
  onChange: (config: DemoSenderConfig) => void
  onReset: () => void
}

function createBlankRedemption(): DemoRedemptionOption {
  return {
    id: `reward-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: "",
    tokenCost: 50,
    rewardValue: "",
    description: "",
  }
}

function toSafeNumber(value: string, fallback = 0) {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback
}

export function SenderProgramSettings({ config, onChange, onReset }: SenderProgramSettingsProps) {
  const totalTreasury = config.startingAllocation + config.topUpTokens

  const updateRedemption = (id: string, field: keyof DemoRedemptionOption, value: string | number) => {
    onChange({
      ...config,
      redemptionOptions: config.redemptionOptions.map((option) =>
        option.id === id ? { ...option, [field]: value } : option
      ),
    })
  }

  const addRedemption = () => {
    onChange({
      ...config,
      redemptionOptions: [...config.redemptionOptions, createBlankRedemption()],
    })
  }

  const removeRedemption = (id: string) => {
    onChange({
      ...config,
      redemptionOptions: config.redemptionOptions.filter((option) => option.id !== id),
    })
  }

  return (
    <div className="space-y-6">
      <Card className="border border-border bg-card">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle className="text-foreground">Token Program Controls</CardTitle>
            <CardDescription className="text-muted-foreground">
              Configure the sender's allocated token pool and how many tokens each subscriber action earns.
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" className="border-border" onClick={onReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Demo
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="startingAllocation" className="text-foreground">
                Initial Allocation
              </Label>
              <Input
                id="startingAllocation"
                type="number"
                min="0"
                value={config.startingAllocation}
                onChange={(e) =>
                  onChange({ ...config, startingAllocation: toSafeNumber(e.target.value, config.startingAllocation) })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="topUpTokens" className="text-foreground">
                Top-Up Tokens
              </Label>
              <Input
                id="topUpTokens"
                type="number"
                min="0"
                value={config.topUpTokens}
                onChange={(e) =>
                  onChange({ ...config, topUpTokens: toSafeNumber(e.target.value, config.topUpTokens) })
                }
              />
            </div>
            <div className="rounded-lg border border-border bg-muted/40 p-4">
              <p className="text-sm text-muted-foreground">Total Sender Treasury</p>
              <div className="mt-2 flex items-center gap-2">
                <Coins className="h-5 w-5 text-primary" />
                <p className="text-2xl font-semibold text-foreground">{totalTreasury.toLocaleString()}</p>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                This represents the token inventory the sender can distribute across campaigns.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="signupReward" className="text-foreground">
                Sign-Up Reward
              </Label>
              <Input
                id="signupReward"
                type="number"
                min="0"
                value={config.interactionRewards.signUp}
                onChange={(e) =>
                  onChange({
                    ...config,
                    interactionRewards: {
                      ...config.interactionRewards,
                      signUp: toSafeNumber(e.target.value, config.interactionRewards.signUp),
                    },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="openReward" className="text-foreground">
                Email Open Reward
              </Label>
              <Input
                id="openReward"
                type="number"
                min="0"
                value={config.interactionRewards.emailOpen}
                onChange={(e) =>
                  onChange({
                    ...config,
                    interactionRewards: {
                      ...config.interactionRewards,
                      emailOpen: toSafeNumber(e.target.value, config.interactionRewards.emailOpen),
                    },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clickReward" className="text-foreground">
                Link Click Reward
              </Label>
              <Input
                id="clickReward"
                type="number"
                min="0"
                value={config.interactionRewards.linkClick}
                onChange={(e) =>
                  onChange({
                    ...config,
                    interactionRewards: {
                      ...config.interactionRewards,
                      linkClick: toSafeNumber(e.target.value, config.interactionRewards.linkClick),
                    },
                  })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border bg-card">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle className="text-foreground">Redemption Catalog</CardTitle>
            <CardDescription className="text-muted-foreground">
              Define what token balances can be redeemed for inside the sender's own ecosystem.
            </CardDescription>
          </div>
          <Button onClick={addRedemption} className="bg-primary hover:bg-[#A34D20] text-primary-foreground">
            <Plus className="h-4 w-4 mr-2" />
            Add Redemption
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {config.redemptionOptions.map((option) => (
            <div key={option.id} className="grid gap-4 rounded-lg border border-border p-4 lg:grid-cols-[1.1fr_140px_160px_auto]">
              <div className="space-y-2">
                <Label className="text-foreground">Reward Name</Label>
                <Input
                  value={option.title}
                  onChange={(e) => updateRedemption(option.id, "title", e.target.value)}
                  placeholder="e.g. 10% Off Next Order"
                />
                <Input
                  value={option.description}
                  onChange={(e) => updateRedemption(option.id, "description", e.target.value)}
                  placeholder="Describe the partial-value incentive or perk."
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Token Cost</Label>
                <Input
                  type="number"
                  min="0"
                  value={option.tokenCost}
                  onChange={(e) => updateRedemption(option.id, "tokenCost", toSafeNumber(e.target.value, option.tokenCost))}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Subscriber Value</Label>
                <Input
                  value={option.rewardValue}
                  onChange={(e) => updateRedemption(option.id, "rewardValue", e.target.value)}
                  placeholder="e.g. $15 credit"
                />
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  className="w-full border-border text-destructive hover:text-destructive"
                  onClick={() => removeRedemption(option.id)}
                  disabled={config.redemptionOptions.length === 1}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
