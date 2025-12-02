import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe('App component', () => {
    it('renders properly', () => {
        render(
            <App/>
        )
        const newMessageBtn = screen.getByRole('button', { name: /new message/i })
        expect(newMessageBtn).toBeInTheDocument()
    })
})