describe('UsersService', () => {
  it('should calculate age', () => {
    // Configurar - Arrange
    const age = 32
    const  name = 'João'
    // Fazer alguma ação - Act
    const result = 2024 - age
    // Conferir se essa ação foi a esperada - Assert
    expect(result).toEqual(1992)
  })
})