"use client";

import { useState } from "react";
import { OrderData } from "../../../lib/types/order";
import { PRICE_LIST } from "../../../lib/utils/priceCalculator";
import { ChromePicker } from "react-color";

interface Step3BProps {
  orderData: OrderData;
  updateOrderData: (data: Partial<OrderData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const Step3B = ({ orderData, updateOrderData, nextStep, prevStep }: Step3BProps) => {
  const [developmentMethod, setDevelopmentMethod] = useState<"fullstack" | "mixmatch">("fullstack");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [currentColor, setCurrentColor] = useState("#ffffff");

  const handleFullstackChange = (type: 'framework' | 'database', value: string) => {
    updateOrderData({
      developmentMethod: 'fullstack',
      fullstackChoice: {
        framework: type === 'framework' ? value : (orderData.fullstackChoice?.framework || ''),
        database: type === 'database' ? value : (orderData.fullstackChoice?.database || '')
      }
    });
  };

  const handleMixMatchChange = (type: 'frontend' | 'backend' | 'api' | 'database', value: string) => {
    updateOrderData({
      developmentMethod: 'mixmatch',
      mixmatchChoice: {
        frontend: type === 'frontend' ? value : (orderData.mixmatchChoice?.frontend || ''),
        backend: type === 'backend' ? value : (orderData.mixmatchChoice?.backend || ''),
        api: type === 'api' ? value : (orderData.mixmatchChoice?.api || ''),
        database: type === 'database' ? value : (orderData.mixmatchChoice?.database || '')
      }
    });
  };

  const handleColorChange = (color: any) => {
    setCurrentColor(color.hex);
    const currentColors = orderData.customColors?.colors || [];
    if (currentColors.length < (orderData.customColors?.count || 0)) {
      updateOrderData({
        customColors: {
          count: orderData.customColors?.count || 1,
          colors: [...currentColors, color.hex]
        }
      });
    }
  };

  // Menghitung total harga
  const calculateTotal = () => {
    let total = 0;

    // Hitung role
    orderData.roles?.forEach(role => {
      total += PRICE_LIST.roles[role] || 0;
    });

    // Hitung stack teknologi
    if (developmentMethod === "fullstack" && orderData.fullstackChoice) {
      total += PRICE_LIST.fullstackFrameworks[orderData.fullstackChoice.framework] || 0;
      total += PRICE_LIST.databases[orderData.fullstackChoice.database] || 0;
    } else if (orderData.mixmatchChoice) {
      total += PRICE_LIST.frontends[orderData.mixmatchChoice.frontend] || 0;
      total += PRICE_LIST.backends[orderData.mixmatchChoice.backend] || 0;
      total += PRICE_LIST.apis[orderData.mixmatchChoice.api] || 0;
      total += PRICE_LIST.databases[orderData.mixmatchChoice.database] || 0;
    }

    // Hitung UI Framework
    orderData.uiFramework?.forEach(framework => {
      total += PRICE_LIST.uiFrameworks[framework] || 0;
    });

    // Hitung notifikasi
    if (orderData.notificationType) {
      total += PRICE_LIST.notifications[orderData.notificationType] || 0;
    }

    // Hitung deadline
    if (orderData.deadline) {
      total += PRICE_LIST.deadlines[orderData.deadline] || 0;
    }

    return total;
  };

  const handleRoleChange = (role: string, checked: boolean) => {
    const currentRoles = orderData.roles || [];
    const newRoles = checked 
      ? [...currentRoles, role]
      : currentRoles.filter(r => r !== role);
    
    updateOrderData({ roles: newRoles });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary text-center">
        Teknologi & UI Framework
      </h2>

      {/* 1. Role Selection */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-white">1️⃣ Role dalam Sistem</h3>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(PRICE_LIST.roles).map(([role, price]) => (
            <label key={role} className="flex items-center space-x-2 p-3 border border-gray-600 rounded-lg">
              <input
                type="checkbox"
                checked={orderData.roles?.includes(role)}
                onChange={(e) => handleRoleChange(role, e.target.checked)}
                className="form-checkbox"
              />
              <span className="text-white">
                {role} - Rp {price.toLocaleString()}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* 2. Development Method */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-white">2️⃣ Metode Pengembangan</h3>
        <div className="space-y-2">
          <label className="flex items-center space-x-2 p-3 border border-gray-600 rounded-lg">
            <input
              type="radio"
              checked={developmentMethod === "fullstack"}
              onChange={() => setDevelopmentMethod("fullstack")}
              className="form-radio"
            />
            <span className="text-white">Fullstack dengan 1 Framework</span>
          </label>
          <label className="flex items-center space-x-2 p-3 border border-gray-600 rounded-lg">
            <input
              type="radio"
              checked={developmentMethod === "mixmatch"}
              onChange={() => setDevelopmentMethod("mixmatch")}
              className="form-radio"
            />
            <span className="text-white">Frontend, Backend, & Database Terpisah (Mix & Match)</span>
          </label>
        </div>
      </div>

      {/* Conditional rendering berdasarkan development method */}
      {developmentMethod === "fullstack" ? (
        <div className="space-y-4">
          {/* Fullstack Framework Selection */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-white">Pilih Framework</h3>
            <select
              className="w-full p-2 bg-black border border-gray-600 rounded-lg text-white"
              value={orderData.fullstackChoice?.framework || ""}
              onChange={(e) => handleFullstackChange('framework', e.target.value)}
            >
              <option value="">Pilih Framework</option>
              {Object.entries(PRICE_LIST.fullstackFrameworks).map(([framework, price]) => (
                <option key={framework} value={framework}>
                  {framework} - Rp {price.toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          {/* Database Selection for Fullstack */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-white">Pilih Database</h3>
            <select
              className="w-full p-2 bg-black border border-gray-600 rounded-lg text-white"
              value={orderData.fullstackChoice?.database || ""}
              onChange={(e) => handleFullstackChange('database', e.target.value)}
            >
              <option value="">Pilih Database</option>
              {Object.entries(PRICE_LIST.databases).map(([db, price]) => (
                <option key={db} value={db}>
                  {db} - Rp {price.toLocaleString()}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : (
        // Mix & Match Options
        <div className="space-y-4">
          {/* Frontend Selection */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-white">Frontend</h3>
            <select
              className="w-full p-2 bg-black border border-gray-600 rounded-lg text-white"
              value={orderData.mixmatchChoice?.frontend || ""}
              onChange={(e) => handleMixMatchChange('frontend', e.target.value)}
            >
              <option value="">Pilih Frontend</option>
              {Object.entries(PRICE_LIST.frontends).map(([tech, price]) => (
                <option key={tech} value={tech}>
                  {tech} - Rp {price.toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          {/* Backend Selection */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-white">Backend</h3>
            <select
              className="w-full p-2 bg-black border border-gray-600 rounded-lg text-white"
              value={orderData.mixmatchChoice?.backend || ""}
              onChange={(e) => handleMixMatchChange('backend', e.target.value)}
            >
              <option value="">Pilih Backend</option>
              {Object.entries(PRICE_LIST.backends).map(([tech, price]) => (
                <option key={tech} value={tech}>
                  {tech} - Rp {price.toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          {/* API Selection */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-white">API</h3>
      <select
              className="w-full p-2 bg-black border border-gray-600 rounded-lg text-white"
              value={orderData.mixmatchChoice?.api || ""}
              onChange={(e) => handleMixMatchChange('api', e.target.value)}
            >
              <option value="">Pilih API</option>
              {Object.entries(PRICE_LIST.apis).map(([tech, price]) => (
                <option key={tech} value={tech}>
                  {tech} - Rp {price.toLocaleString()}
                </option>
              ))}
      </select>
          </div>

          {/* Database Selection */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-white">Database</h3>
      <select
              className="w-full p-2 bg-black border border-gray-600 rounded-lg text-white"
              value={orderData.mixmatchChoice?.database || ""}
              onChange={(e) => handleMixMatchChange('database', e.target.value)}
      >
        <option value="">Pilih Database</option>
              {Object.entries(PRICE_LIST.databases).map(([tech, price]) => (
                <option key={tech} value={tech}>
                  {tech} - Rp {price.toLocaleString()}
                </option>
              ))}
      </select>
          </div>
        </div>
      )}

      {/* 3. UI Framework Selection */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-white">3️⃣ UI Framework</h3>
        
        {/* Conditional UI Framework berdasarkan platform */}
        {orderData.fullstackChoice?.framework?.includes('flutter') || 
         orderData.mixmatchChoice?.frontend?.includes('flutter') ? (
          <div className="space-y-2">
            <label className="flex items-center space-x-2 p-3 border border-gray-600 rounded-lg">
              <input
                type="radio"
                name="flutterUI"
                value="default"
                checked={orderData.uiFramework?.includes('flutter-default')}
                onChange={(e) => updateOrderData({ 
                  uiFramework: ['flutter-default']
                })}
                className="form-radio"
              />
              <span className="text-white">Default Flutter UI (Material/Cupertino) - Gratis</span>
            </label>
            <label className="flex items-center space-x-2 p-3 border border-gray-600 rounded-lg">
              <input
                type="radio"
                name="flutterUI"
                value="custom"
                checked={orderData.uiFramework?.includes('flutter-custom')}
                onChange={(e) => updateOrderData({ 
                  uiFramework: ['flutter-custom']
                })}
                className="form-radio"
              />
              <span className="text-white">Custom UI (GetWidget, FlutterFlow) - Rp 60.000</span>
            </label>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(PRICE_LIST.uiFrameworks).map(([framework, price]) => (
              <label key={framework} className="flex items-center space-x-2 p-3 border border-gray-600 rounded-lg">
                <input
                  type="checkbox"
                  checked={orderData.uiFramework?.includes(framework)}
                  onChange={(e) => {
                    const current = orderData.uiFramework || [];
                    updateOrderData({
                      uiFramework: e.target.checked 
                        ? [...current, framework]
                        : current.filter(f => f !== framework)
                    });
                  }}
                  className="form-checkbox"
                />
                <span className="text-white">
                  {framework} - Rp {price.toLocaleString()}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* 4. Theme Selection */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-white">4️⃣ Tema UI</h3>
      <select
          className="w-full p-2 bg-black border border-gray-600 rounded-lg text-white"
          value={orderData.themeChoice?.mode || ""}
          onChange={(e) => updateOrderData({
            themeChoice: {
              ...orderData.themeChoice,
              mode: e.target.value as "light" | "dark" | "auto" | "custom"
            }
          })}
        >
          <option value="">Pilih Mode Tema</option>
          <option value="light">Light Mode</option>
          <option value="dark">Dark Mode</option>
          <option value="auto">Auto (Switch Dark/Light) - +Rp 20.000</option>
      </select>

      <select
          className="w-full p-2 bg-black border border-gray-600 rounded-lg text-white"
          value={orderData.themeChoice?.style || ""}
          onChange={(e) => updateOrderData({
            themeChoice: {
              ...orderData.themeChoice,
              style: e.target.value
            }
          })}
        >
          <option value="">Pilih Style Tema</option>
          <option value="fresh">Fresh</option>
          <option value="beautiful">Beautiful</option>
          <option value="elegant">Elegant</option>
          <option value="modern">Modern</option>
          <option value="cyberpunk">Cyberpunk</option>
          <option value="minimalist">Minimalist</option>
      </select>
      </div>

      {/* 5. Notification Type */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-white">5️⃣ Tipe Notifikasi</h3>
        
        {orderData.fullstackChoice?.framework?.includes('flutter') || 
         orderData.mixmatchChoice?.frontend?.includes('flutter') ? (
          <div className="space-y-2">
            <label className="flex items-center space-x-2 p-3 border border-gray-600 rounded-lg">
              <input
                type="radio"
                name="notification"
                value="flutter-default"
                checked={orderData.notificationType === 'flutter-default'}
                onChange={(e) => updateOrderData({ notificationType: e.target.value })}
                className="form-radio"
              />
              <span className="text-white">Default Flutter AlertDialog - Gratis</span>
            </label>
            <label className="flex items-center space-x-2 p-3 border border-gray-600 rounded-lg">
              <input
                type="radio"
                name="notification"
                value="flutter-custom"
                checked={orderData.notificationType === 'flutter-custom'}
                onChange={(e) => updateOrderData({ notificationType: e.target.value })}
                className="form-radio"
              />
              <span className="text-white">Custom Snackbar/Toast - Rp 20.000</span>
            </label>
          </div>
        ) : (
          <div className="space-y-2">
            {Object.entries(PRICE_LIST.notifications).map(([type, price]) => (
              <label key={type} className="flex items-center space-x-2 p-3 border border-gray-600 rounded-lg">
                <input
                  type="radio"
                  name="notification"
                  value={type}
                  checked={orderData.notificationType === type}
                  onChange={(e) => updateOrderData({ notificationType: e.target.value })}
                  className="form-radio"
                />
                <span className="text-white">
                  {type} {price > 0 ? `- Rp ${price.toLocaleString()}` : '- Gratis'}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* 6. Custom Colors dengan Submit dan Edit */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-white">6️⃣ Custom Warna UI</h3>
        <div className="space-y-4">
          <input
            type="number"
            min="1"
            max="5"
            value={orderData.customColors?.count || 1}
            onChange={(e) => updateOrderData({
              customColors: {
                count: parseInt(e.target.value),
                colors: orderData.customColors?.colors || []
              }
            })}
            className="w-full p-2 bg-black border border-gray-600 rounded-lg text-white"
            placeholder="Jumlah warna utama (1-5)"
          />

          {showColorPicker && (
            <div className="relative z-50 bg-gray-800 p-4 rounded-lg">
              <ChromePicker
                color={currentColor}
                onChange={handleColorChange}
              />
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => setShowColorPicker(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    const currentColors = orderData.customColors?.colors || [];
                    if (currentColors.length < (orderData.customColors?.count || 1)) {
                      updateOrderData({
                        customColors: {
                          count: orderData.customColors?.count || 1,
                          colors: [...currentColors, currentColor]
                        }
                      });
                    }
                    setShowColorPicker(false);
                  }}
                  className="px-4 py-2 bg-primary text-white rounded-lg"
                >
                  Tambah Warna
                </button>
              </div>
            </div>
          )}

          {/* Display & Edit Colors */}
          <div className="flex flex-wrap gap-2">
            {orderData.customColors?.colors.map((color, index) => (
              <div key={index} className="relative group">
                <div
                  style={{ backgroundColor: color }}
                  className="w-8 h-8 rounded-full border border-gray-600"
                />
                <button
                  onClick={() => {
                    const newColors = [...(orderData.customColors?.colors || [])];
                    newColors.splice(index, 1);
                    updateOrderData({
                      customColors: {
                        count: orderData.customColors?.count || 1,
                        colors: newColors
                      }
                    });
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100"
                >
                  ×
                </button>
              </div>
            ))}
            {(orderData.customColors?.colors.length || 0) < (orderData.customColors?.count || 1) && (
              <button
                onClick={() => setShowColorPicker(true)}
                className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center text-white"
              >
                +
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Total Price Display */}
      <div className="mt-6 p-4 bg-primary bg-opacity-10 border border-primary rounded-lg">
        <h3 className="text-lg font-medium text-white text-center">Total Harga</h3>
        {orderData.discount ? (
          <>
            <p className="text-lg text-gray-400 line-through text-center">
              Rp {calculateTotal().toLocaleString()}
            </p>
            <p className="text-2xl font-bold text-primary text-center">
              Rp {(calculateTotal() * (1 - orderData.discount/100)).toLocaleString()}
            </p>
            <p className="text-sm text-green-500 text-center">
              Hemat {orderData.discount}% (Rp {(calculateTotal() * orderData.discount/100).toLocaleString()})
            </p>
          </>
        ) : (
          <p className="text-2xl font-bold text-primary text-center">
            Rp {calculateTotal().toLocaleString()}
          </p>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={prevStep}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg"
        >
          Kembali
        </button>
        <button
          onClick={nextStep}
          className="px-6 py-2 bg-primary text-white rounded-lg"
        >
          Lanjut
        </button>
      </div>
    </div>
  );
};

export default Step3B;
