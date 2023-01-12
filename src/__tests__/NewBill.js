/**
 * @jest-environment jsdom
 */

import {screen, waitFor} from "@testing-library/dom"
import {ROUTES_PATH} from "../constants/routes.js"
import {localStorageMock} from "../__mocks__/localStorage.js"
import mockStore from "../__mocks__/store.js"

import userEvent from "@testing-library/user-event";

import '@testing-library/jest-dom/extend-expect'

import router from "../app/Router.js";

beforeEach(() => {
  Object.defineProperty(window, 'localStorage', { value: localStorageMock })
  window.localStorage.setItem('user', JSON.stringify({
    type: 'Employee'
  }))
  const root = document.createElement("div")
  root.setAttribute("id", "root")
  document.body.append(root)
  router()
  window.onNavigate(ROUTES_PATH.NewBill)
})

jest.mock("../app/store", () => mockStore)

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then mail icon in vertical layout should be highlighted", async () => {
      await waitFor(() => screen.getByTestId('icon-mail'))
      const mailIcon = screen.getByTestId('icon-mail')
      expect(mailIcon).toHaveClass('active-icon')
    })

    describe("When I don't pick a correct file type", () => {
      test("Then the file input should stay empty", () => {
        const file = screen.getByTestId("file")
        const fakeFile = new File(["test.gif"], "test.gif", {type: "image/gif"})
        userEvent.upload(file, fakeFile);
        
        expect(file.dataset.error).toBeTruthy()
      })
  })

  describe("When I  pick a correct file type", () => {
    test("Then the file input should change", () => {
      const file = screen.getByTestId("file");
      const fakeFile = new File(["test.png"], "test.png", {type: "image/png"})
      userEvent.upload(file, fakeFile)

      expect(file.dataset.error).not.toBeTruthy()
    })
})

  describe("When I fill correctly the form and click submit", () => {
    test("Then it should create a new Bill from API POST", async () => {
      const name = screen.getByTestId("expense-name")
      name.value = "encore"

      const date = screen.getByTestId("datepicker")
      date.value = "2004-04-04"

      const amountTTC = screen.getByTestId("amount")
      amountTTC.value = "400"

      const tvaVAT = screen.getByTestId("vat")
      tvaVAT.value = "80"

      const tvaPCT = screen.getByTestId("pct")
      tvaPCT.value = "20"

      const file = screen.getByTestId("file")
      const fakeFile = new File(["test.png"], "test.png", {type: "image/png"})
      userEvent.upload(file, fakeFile)
  
      const submit = document.getElementById("btn-send-bill")
      userEvent.click(submit)

      await waitFor(() => screen.getByText("encore"))

      expect(screen.getByText("encore")).toBeTruthy()
    })
})
})})