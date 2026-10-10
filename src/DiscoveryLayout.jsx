import { ArrowLeft, ArrowUpRight, Download, LoaderCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { saveSvgPng } from './lib/art-export.js'
import './discoveries.css'

export default function DiscoveryLayout({ id, title, emphasis, description, controls, children, wide = false, mobilePreview = false, resultFirst = mobilePreview, controlsTitle }) {
  return <section className={`discovery-workspace${wide ? ' discovery-workspace-wide' : ''}${resultFirst ? ' discovery-result-first' : ''}${mobilePreview ? ' mobile-workspace' : ''}`} aria-labelledby={`${id}-title`}>
    <div className="discovery-sidebar">
      <a className="back-link" href="/#services"><ArrowLeft size={20} aria-hidden="true" /> Back</a>
      <h1 id={`${id}-title`}>{title}<br /><em>{emphasis}</em></h1>
      <p className="discovery-description">{description}</p>
      {!resultFirst && <div id="discovery-controls" className="discovery-controls" tabIndex={-1}>{controls}</div>}
    </div>
    {resultFirst && <div id="discovery-controls" className="discovery-controls" tabIndex={-1}>{controlsTitle && <h2 className="mobile-controls-title">{controlsTitle}</h2>}{controls}</div>}
    <div className="discovery-result">{children}</div>
  </section>
}

export function SourceNote({ href, children }) {
  return <p className="discovery-note"><a href={href} target="_blank" rel="noreferrer">{children} <ArrowUpRight size={12} aria-hidden="true" /></a></p>
}

export function ArtDownload({ svgRef, makeImage, filename, disabled = false, label = 'Download image' }) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  useEffect(() => () => { if (imageUrl) URL.revokeObjectURL(imageUrl) }, [imageUrl])
  async function download() {
    setSaving(true)
    setError('')
    try { setImageUrl(makeImage ? await makeImage(filename) : await saveSvgPng(svgRef.current, filename)) }
    catch { setError('The image couldn’t be saved. Please try again.') }
    finally { setSaving(false) }
  }
  return <div className="art-download-wrap">
    <button className="secondary-button" type="button" disabled={disabled || saving} onClick={download}>{saving ? <LoaderCircle className="loading-icon" size={16} aria-hidden="true" /> : <Download size={16} aria-hidden="true" />}{saving ? 'Saving…' : label}</button>
    {error && <p className="form-error" role="alert">{error}</p>}
    {imageUrl && <><p className="discovery-note" role="status">PNG ready. <a href={imageUrl} download={filename}>Download PNG</a></p><details className="export-preview"><summary>Preview PNG</summary><img src={imageUrl} alt="Your exported artwork as a PNG" /></details></>}
  </div>
}
