import Icons from '@components/Icon'
import Illustration from '@components/Illustrations'
import Loader from '@components/Loader'
import { WooCommerce } from '@lib/api'
import { formatRupiah } from '@utils/currency'
import { Chart as ChartJS, ChartOptions, registerables } from 'chart.js'
import annotationPlugin from 'chartjs-plugin-annotation'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { format } from 'date-fns'
import React, { useEffect, useMemo, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { createRoot } from 'react-dom/client'
import 'chartjs-adapter-date-fns'

ChartJS.register(...registerables)
ChartJS.register(annotationPlugin)
ChartJS.register(ChartDataLabels)

// plugin to draw vertical hover line
const verticalLinePlugin = {
    id: 'verticalLine',
    afterDraw: (chart: any) => {
        const tooltip = chart.tooltip
        const ctx = chart.ctx
        if (!tooltip || !tooltip._active || tooltip._active.length === 0) return
        const active = tooltip._active[0]
        const x = active.element.x
        ctx.save()
        ctx.beginPath()
        ctx.moveTo(x, chart.chartArea.top)
        ctx.lineTo(x, chart.chartArea.bottom)
        ctx.lineWidth = 1
        ctx.strokeStyle = 'rgba(0,0,0,0.12)'
        ctx.stroke()
        ctx.restore()
    }
}

ChartJS.register(verticalLinePlugin)

interface PricePoint {
    price: number
    currency?: string
    recorded_at: string
    timestamp: number
}

type RangeKey = 'MAX' | '5Y' | '3Y' | '1Y' | '6M' | '3M' | '1M' | 'TODAY'

interface Props {
    productPrice: {
        product_id: number
        name: string
        current_price: number
        currency: string
        history: PricePoint[]
    } | null
}

const getTimeUnitForRange = (key: RangeKey) => {
    switch (key) {
        case 'MAX':
        case '5Y':
        case '3Y':
            return 'year'
        case '1Y':
        case '6M':
        case '3M':
            return 'month'
        case '1M':
        case 'TODAY':
            return 'day'
        default:
            return 'month'
    }
}

const RANGE_KEYS: RangeKey[] = ['MAX', '5Y', '3Y', '1Y', '6M', '3M', '1M', 'TODAY']

const PriceChart: React.FC<Props> = ({ productPrice }) => {
    // store raw history returned from API (initially from productPrice)
    const [rawHistory, setRawHistory] = useState<PricePoint[]>(() =>
        productPrice && Array.isArray(productPrice.history) ? productPrice.history.slice() : []
    )

    // update rawHistory when productPrice prop changes
    useEffect(() => {
        if (productPrice && Array.isArray(productPrice.history)) setRawHistory(productPrice.history.slice())
    }, [productPrice])

    // build data objects so we can attach `percentage_change` when present
    const dataObjects = useMemo(
        () =>
            rawHistory.map((h) => ({
                x: h.timestamp * 1000,
                y: Number(h.price),
                percentage_change: (h as any).percentage_change,
                price_change: (h as any).price_change
            })),
        [rawHistory]
    )

    const labels = useMemo(() => dataObjects.map((d) => new Date(d.x)), [dataObjects])

    const first = dataObjects.length > 0 ? dataObjects[0].y : 0

    const [loadingPeriod, setLoadingPeriod] = useState(false)
    const [selectedPeriod, setSelectedPeriod] = useState<RangeKey>('MAX')

    const mapRangeToPeriod = (r: RangeKey) => {
        switch (r) {
            case 'TODAY':
                return 'today'
            case '1M':
                return '1m'
            case '3M':
                return '3m'
            case '6M':
                return '6m'
            case '1Y':
                return '1y'
            case '3Y':
                return '3y'
            case '5Y':
                return '5y'
            case 'MAX':
            default:
                return 'max'
        }
    }

    const fetchPeriod = async (periodKey: RangeKey) => {
        const productId = productPrice?.product_id
        if (!productId) return
        setLoadingPeriod(true)
        try {
            const periodParam = mapRangeToPeriod(periodKey)
            const res = await WooCommerce.get(`product-price/${productId}?period=${encodeURIComponent(periodParam)}`)
            const payload = res?.data
            let hist: PricePoint[] = []
            if (Array.isArray(payload)) hist = payload
            else if (Array.isArray(payload?.history)) hist = payload.history
            else if (Array.isArray(payload?.data)) hist = payload.data
            setRawHistory(hist)
            setSelectedPeriod(periodKey)
        } catch (e) {
            // keep existing data on error
            console.error('Failed to fetch period data', e)
        } finally {
            setLoadingPeriod(false)
        }
    }

    // compact number formatter for y-axis (e.g., 1.2M, 1.3B)
    const compactFormatter = useMemo(
        () => new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 }),
        []
    )

    const data = useMemo(
        () => ({
            labels,
            datasets: [
                {
                    label: 'Price',
                    // chart.js accepts data as array of {x,y, ...}
                    data: dataObjects,
                    // enable area under the line and supply a scriptable gradient
                    fill: true,
                    borderColor: '#111827',
                    backgroundColor: (ctx: any) => {
                        const chart = ctx.chart
                        const area = chart.chartArea
                        if (!area) return 'rgba(17,24,39,0)'
                        const gradient = chart.ctx.createLinearGradient(0, area.top, 0, area.bottom)
                        gradient.addColorStop(0, 'rgba(17,24,39,0.12)')
                        gradient.addColorStop(1, 'rgba(17,24,39,0)')
                        return gradient
                    },
                    tension: 0.3,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    pointHoverBorderWidth: 2,
                    pointHoverBackgroundColor: '#ffffff',
                    pointHoverBorderColor: '#000000',
                    borderWidth: 3
                }
            ]
        }),
        [labels, dataObjects]
    )

    const options: ChartOptions<'line'> = useMemo(
        () => ({
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: { display: false },
                tooltip: {
                    enabled: false,
                    external: (context) => {
                        const { chart, tooltip } = context

                        // place tooltip in document.body to avoid clipping by chart container
                        const body = typeof document !== 'undefined' ? document.body : null
                        if (!body) return

                        // create tooltip element if not exists
                        let tooltipEl = document.querySelector('.chartjs-custom-tooltip') as HTMLDivElement
                        if (!tooltipEl) {
                            tooltipEl = document.createElement('div')
                            tooltipEl.className = 'chartjs-custom-tooltip pointer-events-none'
                            tooltipEl.style.position = 'fixed'
                            tooltipEl.style.transform = 'translate(-50%, -100%)'
                            tooltipEl.style.zIndex = '9999'
                            body.appendChild(tooltipEl)
                        }

                        if (tooltip.opacity === 0) {
                            tooltipEl.style.display = 'none'
                            return
                        }

                        if (!tooltip.dataPoints || tooltip.dataPoints.length === 0) {
                            tooltipEl.style.display = 'none'
                            return
                        }

                        const dataPoint = tooltip.dataPoints?.[0]
                        const y = dataPoint?.parsed?.y
                        // compute date
                        let d: Date | null = null
                        const x = dataPoint?.parsed?.x
                        if (typeof x === 'number') {
                            d = new Date(x)
                            if (isNaN(d.getTime())) d = new Date(x * 1000)
                        } else if (dataPoint?.label) {
                            const parsed = Date.parse(String(dataPoint.label))
                            if (!isNaN(parsed)) d = new Date(parsed)
                        }
                        // prefer `price_change` object from API for sign/amount; fallback to `percentage_change`, then value comparison
                        const val = typeof y === 'number' ? y : null
                        const raw = (dataPoint as any)?.raw as
                            | { percentage_change?: number | string; price_change?: any }
                            | undefined

                        // resolve percentage and diff from API-provided shape
                        let pctNumber: number | null = null
                        let pctValue = '--'
                        let diffNumber: number | null = null

                        if (raw) {
                            const pc = raw.price_change
                            if (pc != null) {
                                // price_change may be a primitive amount, or an object with fields
                                if (typeof pc === 'number' || typeof pc === 'string') {
                                    const n = Number(pc)
                                    if (!Number.isNaN(n)) diffNumber = n
                                } else if (typeof pc === 'object') {
                                    const p = pc.percentage ?? pc.percentage_change ?? pc.per ?? null
                                    const a = pc.amount ?? pc.diff ?? pc.value ?? pc.change ?? null
                                    if (p != null) {
                                        const n = Number(p)
                                        if (!Number.isNaN(n)) pctNumber = n
                                    }
                                    if (a != null) {
                                        const n = Number(a)
                                        if (!Number.isNaN(n)) diffNumber = n
                                    }
                                }
                            }

                            if (pctNumber == null && raw.percentage_change != null) {
                                const n = Number(raw.percentage_change)
                                if (!Number.isNaN(n)) pctNumber = n
                            }
                        }

                        if (pctNumber != null) pctValue = pctNumber.toFixed(2)

                        // determine positivity with priority: pctNumber -> diffNumber -> val vs first
                        let positive = false
                        if (pctNumber != null) positive = pctNumber > 0
                        else if (diffNumber != null) positive = diffNumber > 0
                        else if (val != null && first) positive = val > first

                        // render react content into tooltipEl using createRoot (React 18+)
                        let tooltipRoot = (tooltipEl as any).__reactRoot as ReturnType<typeof createRoot> | undefined
                        if (!tooltipRoot) {
                            tooltipRoot = createRoot(tooltipEl)
                            ;(tooltipEl as any).__reactRoot = tooltipRoot
                        }

                        tooltipRoot.render(
                            <div className='rounded-lg bg-white p-4 text-left shadow-md' style={{ minWidth: 220 }}>
                                <div className='xl:text-subheading-6-desktop text-subheading-6-mobile'>
                                    {val ? formatRupiah(val) : ''}
                                </div>
                                <div className='mt-1 flex items-center gap-1'>
                                    <Icons
                                        icon={positive ? 'ArrowUp' : 'ArrowUp'}
                                        width={12}
                                        height={12}
                                        className={
                                            positive ? 'text-success-500' : 'text-error-500 rotate-180 transform'
                                        }
                                    />
                                    <span
                                        className={`xl:text-paragraph-10-desktop text-paragraph-10-mobile ${
                                            positive ? 'text-success-500' : 'text-error-500'
                                        }`}
                                    >
                                        {(positive && pctValue !== '--' ? '+' : '') + pctValue}%
                                    </span>
                                    <span
                                        className={`xl:text-paragraph-10-desktop text-paragraph-10-mobile ${
                                            positive ? 'text-success-500' : 'text-error-500'
                                        }`}
                                    >
                                        ({diffNumber != null ? formatRupiah(diffNumber) : '-'})
                                    </span>
                                </div>
                                <div className='text-grey-500 xl:text-paragraph-12-desktop text-paragraph-12-mobile mt-3'>
                                    {d ? format(d, 'MMM d, yyyy') : ''}
                                </div>
                            </div>
                        )

                        tooltipEl.style.display = 'block'
                        // position tooltip using viewport coordinates (fixed)
                        const canvasRect = chart.canvas.getBoundingClientRect()
                        const left = canvasRect.left + (tooltip.caretX ?? 0)
                        const top = canvasRect.top + (tooltip.caretY ?? 0)

                        tooltipEl.style.left = `${left}px`
                        tooltipEl.style.top = `${top - 12}px`
                    }
                },
                datalabels: { display: false },
                annotation: {}
            },
            scales: {
                x: {
                    type: 'time',
                    time: { unit: getTimeUnitForRange(selectedPeriod) as any },
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 8,
                        color: '#A0A0A0'
                    },
                    grid: {
                        // don't draw vertical grid lines coming up from x-axis ticks
                        drawOnChartArea: false
                    }
                },
                y: {
                    ticks: {
                        align: 'center',
                        color: '#A0A0A0',
                        callback: (value) => {
                            if (typeof value === 'number') return compactFormatter.format(value)
                            return String(value)
                        }
                    }
                }
            }
        }),
        [compactFormatter, first, selectedPeriod]
    )

    // early returns after hooks
    if (typeof window === 'undefined') return null

    return (
        <div>
            <div className='mb-4 flex gap-3'>
                {RANGE_KEYS.map((k) => (
                    <button
                        key={k}
                        onClick={() => fetchPeriod(k)}
                        disabled={loadingPeriod}
                        className={`xl:text-paragraph-9-desktop text-paragraph-9-mobile rounded-md border px-4 py-2 !leading-none focus:outline-none ${
                            k === selectedPeriod ? 'bg-black text-white' : 'bg-white text-gray-500'
                        }`}
                    >
                        {k}
                    </button>
                ))}
            </div>

            {/* content area: loading / empty / chart */}
            <div style={{ height: 320, width: '100%' }}>
                {loadingPeriod ? (
                    <div className='flex h-full w-full items-center justify-center'>
                        <Loader width={48} height={48} />
                    </div>
                ) : dataObjects.length === 0 ? (
                    <div className='flex h-full w-full flex-col items-center justify-center gap-3 text-center text-gray-600'>
                        <Illustration name='Notfound' />
                        <div className='text-lg font-medium'>No price history</div>
                    </div>
                ) : (
                    <Line data={data} options={options} plugins={[ChartDataLabels]} />
                )}
            </div>
        </div>
    )
}

export default PriceChart
