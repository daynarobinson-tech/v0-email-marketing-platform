"use client"

import { useEffect, useState } from "react"

export interface DemoInteractionRewards {
  signUp: number
  emailOpen: number
  linkClick: number
}

export interface DemoRedemptionOption {
  id: string
  title: string
  tokenCost: number
  rewardValue: string
  description: string
}

export interface DemoSenderConfig {
  startingAllocation: number
  topUpTokens: number
  interactionRewards: DemoInteractionRewards
  redemptionOptions: DemoRedemptionOption[]
}

const STORAGE_KEY = "bloom-demo-sender-config"

export const defaultDemoSenderConfig: DemoSenderConfig = {
  startingAllocation: 50000,
  topUpTokens: 10000,
  interactionRewards: {
    signUp: 10,
    emailOpen: 5,
    linkClick: 10,
  },
  redemptionOptions: [
    {
      id: "discount-25",
      title: "25 Tokens",
      tokenCost: 25,
      rewardValue: "5% off",
      description: "Applies to the subscriber's next purchase in your store.",
    },
    {
      id: "discount-75",
      title: "75 Tokens",
      tokenCost: 75,
      rewardValue: "10% off",
      description: "Unlocks a stronger discount on a future order.",
    },
    {
      id: "vip-150",
      title: "150 Tokens",
      tokenCost: 150,
      rewardValue: "VIP perk",
      description: "Redeem for a premium add-on, upgrade, or exclusive drop.",
    },
  ],
}

function parseStoredConfig(value: string | null): DemoSenderConfig {
  if (!value) return defaultDemoSenderConfig

  try {
    const parsed = JSON.parse(value) as Partial<DemoSenderConfig>

    return {
      startingAllocation: parsed.startingAllocation ?? defaultDemoSenderConfig.startingAllocation,
      topUpTokens: parsed.topUpTokens ?? defaultDemoSenderConfig.topUpTokens,
      interactionRewards: {
        signUp: parsed.interactionRewards?.signUp ?? defaultDemoSenderConfig.interactionRewards.signUp,
        emailOpen:
          parsed.interactionRewards?.emailOpen ?? defaultDemoSenderConfig.interactionRewards.emailOpen,
        linkClick:
          parsed.interactionRewards?.linkClick ?? defaultDemoSenderConfig.interactionRewards.linkClick,
      },
      redemptionOptions:
        parsed.redemptionOptions?.length ? parsed.redemptionOptions : defaultDemoSenderConfig.redemptionOptions,
    }
  } catch {
    return defaultDemoSenderConfig
  }
}

export function useDemoSenderConfig() {
  const [config, setConfig] = useState<DemoSenderConfig>(defaultDemoSenderConfig)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    setConfig(parseStoredConfig(stored))
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (!isLoaded) return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
  }, [config, isLoaded])

  const resetConfig = () => {
    setConfig(defaultDemoSenderConfig)
    window.localStorage.removeItem(STORAGE_KEY)
  }

  return {
    config,
    isLoaded,
    setConfig,
    resetConfig,
  }
}
