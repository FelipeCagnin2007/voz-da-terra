import React, { useState, useEffect } from 'react'

export const DataMonitoring = () => {
  const [citySearch, setCitySearch] = useState('São Paulo')
  const [aqiData, setAqiData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const token = '66a9e7f53e9a7f9acf4519dbdbf5747c702a5115'

  const searchWAQI = async () => {
    if (!citySearch) return
    setIsLoading(true)
    setErrorMsg('')

    try {
      const response = await fetch(`https://api.waqi.info/feed/${citySearch}/?token=${token}`)
      const result = await response.json()
      if (result.status === 'ok') {
        setAqiData(result.data)
      } else {
        setErrorMsg('Cidade não encontrada ou dados indisponíveis. Tente o nome em inglês.')
        setAqiData(null)
      }
    } catch (err) {
      setErrorMsg('Houve um erro na conexão com a API.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    searchWAQI()
  }, [])

  const getAqiColor = () => {
    if (!aqiData) return 'var(--dark-green)'
    const aqi = aqiData.aqi
    if (aqi <= 50) return '#4caf50'
    if (aqi <= 100) return '#fbc02d'
    return '#f44336'
  }

  const getAqiStatus = () => {
    if (!aqiData) return ''
    const aqi = aqiData.aqi
    if (aqi <= 50) return 'Bom'
    if (aqi <= 100) return 'Moderado'
    if (aqi <= 150) return 'Insalubre para sensíveis'
    if (aqi <= 200) return 'Insalubre'
    return 'Muito Perigoso'
  }

  const getAqiPercentage = () => {
    if (!aqiData) return 0
    return Math.min((aqiData.aqi / 300) * 100, 100)
  }

  return (
    <section className="feed-container">
      <header className="blog-header">
        <h1>Monitoramento Global</h1>
        <p style={{ color: 'var(--text-light)', marginTop: '-10px', marginBottom: '30px' }}>
          Acompanhe a qualidade do ar em tempo real em qualquer lugar do mundo.
        </p>
      </header>

      <div className="search-section">
        <div className="search-input-wrapper">
          <input 
            type="text" 
            value={citySearch} 
            onChange={(e) => setCitySearch(e.target.value)}
            onKeyUp={(e) => e.key === 'Enter' && searchWAQI()}
            placeholder="Digite o nome da cidade (Ex: São Paulo, Jundiaí...)" 
            disabled={isLoading} 
          />
        </div>
        <button className="btn-search" onClick={searchWAQI} disabled={isLoading || !citySearch}>
          {isLoading ? <div className="spinner"></div> : 'Buscar'}
        </button>
      </div>

      {errorMsg && <div className="error-message">{errorMsg}</div>}

      {isLoading && (
        <div className="loading-overlay">
          <p>Consultando satélites e estações terrestres...</p>
        </div>
      )}

      {aqiData && !isLoading && (
        <div className="data-results">
          <div className="stats-grid">
            <div className="stat-card show">
              <span className="stat-label">Índice de Qualidade (AQI)</span>
              <h2 className="stat-value" style={{ color: getAqiColor() }}>{aqiData.aqi}</h2>
              <span className="stat-change" style={{ color: getAqiColor() }}>{getAqiStatus()}</span>
            </div>
            <div className="stat-card show">
              <span className="stat-label">Poluente Dominante</span>
              <h2 className="stat-value" style={{ fontSize: '1.8rem', textTransform: 'uppercase' }}>{aqiData.dominentpol}</h2>
              <span className="stat-change" style={{ color: 'var(--text-light)' }}>Estação: {aqiData.city.name.split(',')[0]}</span>
            </div>
            <div className="stat-card show">
              <span className="stat-label">Última Atualização</span>
              <h2 className="stat-value" style={{ fontSize: '1.5rem' }}>{new Date(aqiData.time.s).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</h2>
              <span className="stat-change" style={{ color: 'var(--text-light)' }}>Fuso Local</span>
            </div>
          </div>

          <article className="article-card chart-container">
            <div className="article-body">
              <h2>Nível de Poluição: {aqiData.city.name}</h2>
              <div className="simple-bar-chart">
                <div className="bar-group">
                  <label>Air Quality Index (AQI)</label>
                  <div className="bar-bg">
                    <div className="bar-fill" style={{ width: getAqiPercentage() + '%', background: getAqiColor() }}></div>
                  </div>
                </div>
              </div>
              <p style={{ marginTop: '20px', fontSize: '0.9rem', color: 'var(--text-light)' }}>
                O AQI é uma medida padronizada globalmente para comunicar o quão poluído o ar está atualmente.
              </p>
            </div>
          </article>
        </div>
      )}
    </section>
  )
}
