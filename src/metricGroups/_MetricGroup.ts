import {
  Registry,
  type Metric,
  Counter,
  Gauge,
  Summary,
  Histogram,
} from 'prom-client'

export class MetricGroup {
  metrics: Record<string, Metric> = {}
  prefix: string
  register: Registry
  constructor (prefix: string) {
    this.prefix = prefix
    this.register = new Registry()
  }

  private addMetric <T extends string>(
    MetricConstructor: typeof Counter<T> | typeof Gauge<T> | typeof Summary<T> | typeof Histogram<T>,
    name: T,
    help: string,
    labels?: string[],
  ): this {
    this.metrics[name] = new MetricConstructor({
      name: `${this.prefix}_${name}`,
      help,
      registers: [this.register],
      labelNames: labels as T[] ?? [],
    })
    return this
  }

  addCounter <T extends string>(
    name: T,
    help: string,
    labels?: string[],
  ): this {
    return this.addMetric(Counter, name, help, labels)
  }

  addGauge <T extends string>(
    name: T,
    help: string,
    labels?: string[],
  ): this {
    return this.addMetric(Gauge, name, help, labels)
  }

  addSummary <T extends string>(
    name: T,
    help: string,
    labels?: string[],
  ): this {
    return this.addMetric(Summary, name, help, labels)
  }

  addHistogram <T extends string>(
    name: T,
    help: string,
    labels?: string[],
  ): this {
    return this.addMetric(Histogram, name, help, labels)
  }

  getCounter (name: string): Counter {
    return this.metrics[name] as Counter
  }

  getGauge (name: string): Gauge {
    return this.metrics[name] as Gauge
  }

  getSummary (name: string): Summary {
    return this.metrics[name] as Summary
  }

  getHistogram (name: string): Histogram {
    return this.metrics[name] as Histogram
  }
}
