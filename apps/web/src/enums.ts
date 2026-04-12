export enum UNITS {
  TEMPERATURE = "°C",
  HASHRATE = "TH/s",
  EFFICIENCY = "W/THs",
  POWER = "kW",
  RPM = "RPM",
  VOLTAGE = "V",
  FREQUENCY = "MHz",
  HASHRATEERRORS = "H/s",
}

export enum POOL_STATUS {
  ALIVE = "alive",
  DEAD = "dead",
  DEGRADED = "degraded",
}

export enum TUNER_STATUS {
  STABLE = "stable",
  UNSTABLE = "unstable",
  ERROR = "error",
}

export enum METRIC_LABEL {
  REAL_HASHRATE = "realHashrate",
  TEMPERATURE = "temperature",
  EFFICIENCY = "efficiency",
  POWER = "power",
  DPS = "dps",
  POOL_STATUS = "poolStatus",
  TUNER_STATUS = "tunerStatus",
}
