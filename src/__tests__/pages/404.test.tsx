import NotFoundPage from '@pages/404'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

describe('404', () => {
    it('renders a heading', () => {
        render(<NotFoundPage />)

        const heading = screen.getByText(/not found/i)

        expect(heading).toBeInTheDocument()
    })
})
