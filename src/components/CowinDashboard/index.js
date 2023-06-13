// Write your code here
import {Component} from 'react'

import Loader from 'react-loader-spinner'

import {
  PieChart,
  Pie,
  Legend,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from 'recharts'

import VaccinationCoverage from '../VaccinationCoverage'

import VaccinationByAge from '../VaccinationByAge'

import VaccinationByGender from '../VaccinationByGender'

import './index.css'

const apiStatusView = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

class CoWinDashboard extends Component {
  state = {
    apiStatus: apiStatusView.initial,
    vaccinationData: [],
    vaccinationByAge: [],
    vaccinationByGender: [],
  }

  componentDidMount() {
    this.getVaccinationDetails()
  }

  getVaccinationData = a => ({
    dose1: a.dose_1,
    dose2: a.dose_2,
    vaccineDate: a.vaccine_date,
  })

  getVaccinationDetails = async () => {
    const {apiStatus} = this.state
    console.log(apiStatus)
    this.setState({
      apiStatus: apiStatusView.inProgress,
    })
    const response = await fetch('https://apis.ccbp.in/covid-vaccination-data')
    if (response.ok) {
      const data = await response.json()
      const vaccineData = data.last_7_days_vaccination.map(eachObj =>
        this.getVaccinationData(eachObj),
      )
      const vaccinationAgeData = data.vaccination_by_age
      const vaccinationGenderData = data.vaccination_by_gender
      //   console.log(data)
      //   console.log(vaccineData)
      this.setState({
        vaccinationData: vaccineData,
        vaccinationByAge: vaccinationAgeData,
        vaccinationByGender: vaccinationGenderData,
        apiStatus: apiStatusView.success,
      })
    } else {
      this.setState({apiStatus: apiStatusView.failure})
    }
  }

  renderVaccineDetails = () => {
    const {vaccinationData, vaccinationByAge, vaccinationByGender} = this.state
    console.log(vaccinationByAge, vaccinationData, vaccinationByGender)
    const DataFormatter = number => {
      if (number > 500) {
        return `${(number / 500).toString()}k`
      }
      return number.toString()
    }
    return (
      <>
        <VaccinationCoverage>
          <h1 className="heading">Vaccination Coverage</h1>
          <BarChart
            width={1000}
            height={300}
            margin={{
              top: 5,
            }}
            data={vaccinationData}
          >
            <XAxis
              dataKey="vaccineDate"
              tick={{
                stroke: 'gray',
                strokeWidth: 1,
              }}
            />
            <YAxis
              tickFormatter={DataFormatter}
              tick={{
                stroke: 'gray',
                strokeWidth: 0,
              }}
            />
            <Legend
              wrapperStyle={{
                padding: 30,
              }}
            />
            <Bar dataKey="dose1" name="Dose 1" fill="#5a8dee" barSize="20%" />
            <Bar dataKey="dose2" name="Dose 2" fill="#f54394" barSize="20%" />
          </BarChart>
        </VaccinationCoverage>
        <VaccinationByGender>
          <h1 className="heading">Vaccination by gender</h1>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                cx="70%"
                cy="40%"
                data={vaccinationByGender}
                startAngle={180}
                endAngle={0}
                innerRadius="40%"
                outerRadius="70%"
                dataKey="count"
              >
                <Cell name="Male" fill="#f54394" />
                <Cell name="Female" fill="#5a8dee" />
                <Cell name="others" fill="#2cc6c6" />
              </Pie>
              <Legend
                iconType="circle"
                layout="horizontal"
                verticalAlign="middle"
                align="center"
              />
            </PieChart>
          </ResponsiveContainer>
        </VaccinationByGender>
        <VaccinationByAge>
          <h1 className="heading">Vaccination by Age</h1>
          <PieChart>
            <Pie
              cx="70%"
              cy="40%"
              data={vaccinationByAge}
              startAngle={0}
              endAngle={360}
              innerRadius="0%"
              outerRadius="70%"
              dataKey="count"
            >
              <Cell name="18-44" fill=" #2d87bb" />
              <Cell name="45-60" fill="#a3df9f" />
              <Cell name="Above 60" fill=" #64c2a6" />
            </Pie>
            <Legend
              iconType="circle"
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
            />
          </PieChart>
        </VaccinationByAge>
      </>
    )
  }

  renderLoader = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  renderFailure = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="failure-msg">Something Went Wrong</h1>
    </div>
  )

  renderVaccination = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusView.success:
        return this.renderVaccineDetails()
      case apiStatusView.failure:
        return this.renderFailure()
      case apiStatusView.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="container">
        <div className="logo-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
            className="logo"
          />
          <h1 className="logo-heading">Co-WIN</h1>
        </div>
        <h1 className="sub-name">CoWIN Vaccination in India</h1>
        {this.renderVaccination()}
      </div>
    )
  }
}
export default CoWinDashboard
