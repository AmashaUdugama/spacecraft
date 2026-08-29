// // import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// // import { AuthProvider } from "./context/AuthContext";
// // import ProtectedRoute from "./components/ProtectedRoute";
// // import Navbar from "./components/Navbar";
// // import AmbientBackground from "./components/AmbientBackground";

// // import Login from "./pages/Login";
// // import Register from "./pages/Register";
// // import Upload from "./pages/Upload";
// // import Dashboard from "./pages/Dashboard";
// // import History from "./pages/History";

// // export default function App() {
// //   return (
// //     <AuthProvider>
// //       <BrowserRouter>
// //         <AmbientBackground />
// //         <Navbar />
// //         <Routes>
// //           <Route path="/" element={<Navigate to="/upload" replace />} />
// //           <Route path="/login" element={<Login />} />
// //           <Route path="/register" element={<Register />} />
// //           <Route
// //             path="/upload"
// //             element={
// //               <ProtectedRoute>
// //                 <Upload />
// //               </ProtectedRoute>
// //             }
// //           />
// //           <Route
// //             path="/dashboard"
// //             element={
// //               <ProtectedRoute>
// //                 <Dashboard />
// //               </ProtectedRoute>
// //             }
// //           />
// //           <Route
// //             path="/history"
// //             element={
// //               <ProtectedRoute>
// //                 <History />
// //               </ProtectedRoute>
// //             }
// //           />
// //           <Route path="*" element={<Navigate to="/upload" replace />} />
// //         </Routes>
// //       </BrowserRouter>
// //     </AuthProvider>
// //   );
// // }
// // // import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// // // import { AuthProvider } from "./context/AuthContext";
// // // import ProtectedRoute from "./components/ProtectedRoute";
// // // import Navbar from "./components/Navbar";

// // // import Login from "./pages/Login";
// // // import Register from "./pages/Register";
// // // import Upload from "./pages/Upload";
// // // import Dashboard from "./pages/Dashboard";
// // // import History from "./pages/History";

// // // export default function App() {
// // //   return (
// // //     <AuthProvider>
// // //       <BrowserRouter>
// // //         <Navbar />
// // //         <Routes>
// // //           <Route path="/" element={<Navigate to="/upload" replace />} />
// // //           <Route path="/login" element={<Login />} />
// // //           <Route path="/register" element={<Register />} />
// // //           <Route
// // //             path="/upload"
// // //             element={
// // //               <ProtectedRoute>
// // //                 <Upload />
// // //               </ProtectedRoute>
// // //             }
// // //           />
// // //           <Route
// // //             path="/dashboard"
// // //             element={
// // //               <ProtectedRoute>
// // //                 <Dashboard />
// // //               </ProtectedRoute>
// // //             }
// // //           />
// // //           <Route
// // //             path="/history"
// // //             element={
// // //               <ProtectedRoute>
// // //                 <History />
// // //               </ProtectedRoute>
// // //             }
// // //           />
// // //           <Route path="*" element={<Navigate to="/upload" replace />} />
// // //         </Routes>
// // //       </BrowserRouter>
// // //     </AuthProvider>
// // //   );
// // // }
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { AuthProvider } from "./context/AuthContext";
// import ProtectedRoute from "./components/ProtectedRoute";
// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";
// import AmbientBackground from "./components/AmbientBackground";

// import About from "./pages/About";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Upload from "./pages/Upload";
// import Dashboard from "./pages/Dashboard";
// import History from "./pages/History";

// export default function App() {
//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         <AmbientBackground />
//         <div className="app-shell">
//           <Navbar />
//           <main className="app-main">
//             <Routes>
//               <Route path="/" element={<About />} />
//               <Route path="/about" element={<About />} />
//               <Route path="/login" element={<Login />} />
//               <Route path="/register" element={<Register />} />
//               <Route
//                 path="/upload"
//                 element={
//                   <ProtectedRoute>
//                     <Upload />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/dashboard"
//                 element={
//                   <ProtectedRoute>
//                     <Dashboard />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/history"
//                 element={
//                   <ProtectedRoute>
//                     <History />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route path="*" element={<Navigate to="/" replace />} />
//             </Routes>
//           </main>
//           <Footer />
//         </div>
//       </BrowserRouter>
//     </AuthProvider>
//   );
// }
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AmbientBackground from "./components/AmbientBackground";

import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Upload from "./pages/Upload";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename="/spacecraft">
        <AmbientBackground />
        <div className="app-shell">
          <Navbar />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<About />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/upload"
                element={
                  <ProtectedRoute>
                    <Upload />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/history"
                element={
                  <ProtectedRoute>
                    <History />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}