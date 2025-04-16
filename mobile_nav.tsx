              {/* Navegação compacta para dispositivos móveis */}
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                className={`py-xs border-b ${border}`}
                contentContainerStyle={{ paddingHorizontal: 4 }}
              >
                {availableComponents.map((component) => (
                  <Pressable
                    key={component.id}
                    onPress={() => setActiveComponent(component.id as 'input' | 'select' | 'accordion' | 'button' | 'designSystem' | 'toast')}
                    className={`mx-xs px-lg py-xs rounded-full ${
                      activeComponent === component.id
                        ? isDark
                          ? 'bg-primary-dark'
                          : 'bg-primary-light'
                        : isDark 
                          ? 'bg-bg-tertiary-dark' 
                          : 'bg-bg-tertiary-light'
                    }`}
                  >
                    <Text
                      className={`${
                        activeComponent === component.id
                          ? 'text-white'
                          : textPrimary
                      } text-label-md font-jakarta-semibold`}
                    >
                      {component.name}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView> 