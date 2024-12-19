"use client";
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';

interface Building {
  id: string;
  position: [number, number, number];
  scale: [number, number, number];
  name: string;
  type: 'residential' | 'facility';
  residents?: number;
  status?: 'normal' | 'warning' | 'alert';
  entrance?: {
    position: 'north' | 'south' | 'east' | 'west';
    offset?: number;  // 入口在墙面上的偏移量
  };
}

const buildings: Building[] = [
  { id: '1', position: [-20, 0, -15], scale: [8, 30, 8], name: '1号楼', type: 'residential', residents: 120, status: 'normal', entrance: { position: 'south' } },
  { id: '2', position: [-7, 0, -15], scale: [8, 24, 8], name: '2号楼', type: 'residential', residents: 96, status: 'normal', entrance: { position: 'south' } },
  { id: '3', position: [7, 0, -15], scale: [8, 28, 8], name: '3号楼', type: 'residential', residents: 108, status: 'warning', entrance: { position: 'south' } },
  { id: '4', position: [20, 0, -15], scale: [8, 26, 8], name: '4号楼', type: 'residential', residents: 102, status: 'normal', entrance: { position: 'south' } },
  { id: '5', position: [-13, 0, 0], scale: [8, 32, 8], name: '5号楼', type: 'residential', residents: 126, status: 'normal', entrance: { position: 'east' } },
  { id: '6', position: [0, 0, 0], scale: [8, 30, 8], name: '6号楼', type: 'residential', residents: 120, status: 'normal', entrance: { position: 'west' } },
  { id: '7', position: [13, 0, 0], scale: [8, 28, 8], name: '7号楼', type: 'residential', residents: 108, status: 'normal', entrance: { position: 'west' } },
  { id: '8', position: [-20, 0, 15], scale: [8, 26, 8], name: '8号楼', type: 'residential', residents: 102, status: 'alert', entrance: { position: 'north' } },
  { id: '9', position: [-7, 0, 15], scale: [8, 24, 8], name: '9号楼', type: 'residential', residents: 96, status: 'normal', entrance: { position: 'north' } },
  { id: '10', position: [7, 0, 15], scale: [8, 28, 8], name: '10号楼', type: 'residential', residents: 108, status: 'normal', entrance: { position: 'north' } },
  { id: '11', position: [20, 0, 15], scale: [8, 30, 8], name: '11号楼', type: 'residential', residents: 120, status: 'normal', entrance: { position: 'north' } },
  { id: '12', position: [0, 0, 25], scale: [8, 32, 8], name: '12号楼', type: 'residential', residents: 126, status: 'normal', entrance: { position: 'south' } },
  // Facilities
  { id: 'p1', position: [-13, 0, -25], scale: [26, 2, 16], name: '地下停车场', type: 'facility', entrance: { position: 'south', offset: -10 } },
  { id: 'c1', position: [13, 0, -25], scale: [13, 2, 10], name: '充电站', type: 'facility', entrance: { position: 'south' } },
  { id: 'f1', position: [0, 0, -7], scale: [10, 2, 10], name: '休闲广场', type: 'facility' },
];

export function ParkMap3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x001529);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(50, 50, 80);
    camera.lookAt(0, 0, 0);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);

    // Label renderer setup
    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0';
    containerRef.current.appendChild(labelRenderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, labelRenderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 30;
    controls.maxDistance = 150;
    controls.maxPolarAngle = Math.PI / 2 - 0.1; // 限制俯视角度

    // Add ground with basic texture
    const groundGeometry = new THREE.PlaneGeometry(200, 200);
    const groundMaterial = new THREE.MeshPhongMaterial({
      color: 0x999999,  // 浅灰色地面
      transparent: true,
      opacity: 0.8,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.1;
    ground.receiveShadow = true;
    scene.add(ground);

    // Add grid helper (make it less visible)
    const gridHelper = new THREE.GridHelper(200, 40, 0xffffff, 0xffffff);
    gridHelper.position.y = 0.1;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.1;
    scene.add(gridHelper);

    // Enhance lighting for better shadows
    const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(50, 100, 30);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.left = -100;
    directionalLight.shadow.camera.right = 100;
    directionalLight.shadow.camera.top = 100;
    directionalLight.shadow.camera.bottom = -100;
    scene.add(directionalLight);

    // Create buildings
    for (const building of buildings) {
      if (building.type === 'residential') {
        // Calculate number of floors
        const floorHeight = 3;
        const numFloors = Math.floor(building.scale[1] / floorHeight);

        // Create main building structure
        const buildingGeometry = new THREE.BoxGeometry(1, 1, 1);
        const buildingMaterial = new THREE.MeshPhongMaterial({
          color: building.status === 'warning' ? 0xffa500 : building.status === 'alert' ? 0xff4444 : 0x00a0e9,
          transparent: true,
          opacity: 0.85,
          emissive: 0x001529,
          emissiveIntensity: 0.1,
          shininess: 50,
        });

        const buildingMesh = new THREE.Mesh(buildingGeometry, buildingMaterial);
        // Adjust Y position to start from ground
        buildingMesh.position.set(
          building.position[0],
          building.position[1] + building.scale[1]/2,
          building.position[2]
        );
        buildingMesh.scale.set(...building.scale);
        buildingMesh.castShadow = true;
        buildingMesh.receiveShadow = true;
        scene.add(buildingMesh);

        // Create floor lines with subtle effect
        for (let i = 1; i < numFloors; i++) {
          const floorGeometry = new THREE.BoxGeometry(
            building.scale[0] + 0.1,
            0.1,
            building.scale[2] + 0.1
          );
          const floorMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.15,
            emissive: 0xffffff,
            emissiveIntensity: 0.05,
          });
          const floor = new THREE.Mesh(floorGeometry, floorMaterial);
          floor.position.set(
            building.position[0],
            building.position[1] + i * floorHeight,
            building.position[2]
          );
          scene.add(floor);
        }
      } else {
        // Create facility buildings (simplified)
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshPhongMaterial({
          color: 0x4a90e2,
          transparent: true,
          opacity: 0.85,
          emissive: 0x001529,
          emissiveIntensity: 0.1,
          shininess: 50,
        });

        const mesh = new THREE.Mesh(geometry, material);
        // Adjust Y position to start from ground
        mesh.position.set(
          building.position[0],
          building.position[1] + building.scale[1]/2,
          building.position[2]
        );
        mesh.scale.set(...building.scale);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        scene.add(mesh);
      }

      // Create building labels
      const labelDiv = document.createElement('div');
      labelDiv.className = 'building-label';
      labelDiv.style.padding = '8px 12px';
      labelDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
      labelDiv.style.color = '#ffffff';
      labelDiv.style.borderRadius = '6px';
      labelDiv.style.fontSize = '16px';
      labelDiv.style.fontWeight = 'bold';
      labelDiv.style.whiteSpace = 'nowrap';

      // Building status colors
      const statusColors = {
        normal: '#4CAF50',    // 绿色
        warning: '#FFA500',   // 橙色
        alert: '#FF0000'      // 红色
      };

      // Status indicator
      const statusEmoji = {
        normal: '✅',
        warning: '⚠️',
        alert: '🚨'
      };

      // Set border and glow color based on building status
      const glowColor = building.type === 'residential' ? 
        (building.status ? statusColors[building.status] : statusColors.normal) : 
        '#00ffff';  // 公共设施使用青色
      
      labelDiv.style.border = `2px solid ${glowColor}`;
      labelDiv.style.boxShadow = `0 0 10px ${glowColor}, inset 0 0 10px ${glowColor}`;
      
      // Create unique animation name for each status
      const animationName = `glow_${building.status || 'normal'}_${building.id}`;
      
      // Add CSS animation for glow effect
      const style = document.createElement('style');
      style.textContent = `
        @keyframes ${animationName} {
          from {
            box-shadow: 0 0 5px ${glowColor},
                        inset 0 0 5px ${glowColor};
          }
          to {
            box-shadow: 0 0 20px ${glowColor},
                        inset 0 0 10px ${glowColor};
          }
        }
      `;
      document.head.appendChild(style);
      
      labelDiv.style.animation = `${animationName} 1.5s ease-in-out infinite alternate`;

      let labelContent = `${building.name}`;
      if (building.type === 'residential') {
        const floors = Math.floor(building.scale[1] / 3); // 假设每层3米
        labelContent += `<br/>
          <span style="font-size: 14px; opacity: 0.9">
            ${building.residents}人 | ${floors}层<br/>
            高度: ${Math.round(building.scale[1])}m
            ${building.status ? ` | ${statusEmoji[building.status]}` : ''}
          </span>`;
      }

      labelDiv.innerHTML = labelContent;
      
      // Create the label object
      const label = new CSS2DObject(labelDiv);
      
      // Position the label above the building
      label.position.set(
        building.position[0],
        building.scale[1] + 2, // 在建筑顶部上方2米
        building.position[2]
      );
      
      scene.add(label);
    }

    // Add entrance markers for buildings
    buildings.forEach(building => {
      if (building.entrance) {
        const entranceWidth = 1.5;  // 缩小入口标记
        const entranceDepth = 0.3;
        const entranceHeight = 2.5;

        // Calculate entrance position based on building dimensions and entrance position
        let entranceX = building.position[0];
        let entranceZ = building.position[2];
        const offset = building.entrance.offset || 0;

        switch (building.entrance.position) {
          case 'north':
            entranceZ = building.position[2] + building.scale[2]/2;
            entranceX += offset;
            break;
          case 'south':
            entranceZ = building.position[2] - building.scale[2]/2;
            entranceX += offset;
            break;
          case 'east':
            entranceX = building.position[0] + building.scale[0]/2;
            entranceZ += offset;
            break;
          case 'west':
            entranceX = building.position[0] - building.scale[0]/2;
            entranceZ += offset;
            break;
        }

        // Create entrance marker
        const entranceGeometry = new THREE.BoxGeometry(
          building.entrance.position === 'north' || building.entrance.position === 'south' ? entranceWidth : entranceDepth,
          entranceHeight,
          building.entrance.position === 'north' || building.entrance.position === 'south' ? entranceDepth : entranceWidth
        );
        const entranceMaterial = new THREE.MeshPhongMaterial({
          color: 0xc0c0c0,
          transparent: true,
          opacity: 0.9,
          emissive: 0x404040,
          emissiveIntensity: 0.2,
        });
        const entranceMesh = new THREE.Mesh(entranceGeometry, entranceMaterial);
        entranceMesh.position.set(entranceX, entranceHeight/2, entranceZ);
        scene.add(entranceMesh);

        // Add entrance icon
        const entranceIconDiv = document.createElement('div');
        entranceIconDiv.innerHTML = '🚪';
        entranceIconDiv.style.fontSize = '14px';  // 缩小图标
        const entranceIcon = new CSS2DObject(entranceIconDiv);
        entranceIcon.position.set(entranceX, entranceHeight + 0.5, entranceZ);
        scene.add(entranceIcon);
      }
    });

    // Update legend style
    const legendDiv = document.createElement('div');
    legendDiv.style.position = 'absolute';
    legendDiv.style.top = '20px';
    legendDiv.style.right = '20px';
    legendDiv.style.padding = '15px';
    legendDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    legendDiv.style.color = '#ffffff';
    legendDiv.style.borderRadius = '8px';
    legendDiv.style.fontSize = '16px';
    legendDiv.style.fontWeight = 'bold';
    legendDiv.style.border = '2px solid #00ffff';
    legendDiv.style.boxShadow = '0 0 10px #00ffff, inset 0 0 10px #00ffff';
    legendDiv.style.animation = 'glow 1.5s ease-in-out infinite alternate';
    legendDiv.style.zIndex = '1000';

    legendDiv.innerHTML = `
      <div style="margin-bottom: 10px; font-size: 18px;">建筑状态说明</div>
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <div>✅ 正常运行</div>
        <div>⚠️ 需要维护</div>
        <div>🚨 需要维修</div>
      </div>
    `;

    // Add scale bar with new style
    const scaleDiv = document.createElement('div');
    scaleDiv.style.position = 'absolute';
    scaleDiv.style.bottom = '20px';
    scaleDiv.style.right = '20px';
    scaleDiv.style.padding = '15px';
    scaleDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    scaleDiv.style.color = '#ffffff';
    scaleDiv.style.borderRadius = '8px';
    scaleDiv.style.fontSize = '16px';
    scaleDiv.style.fontWeight = 'bold';
    scaleDiv.style.border = '2px solid #00ffff';
    scaleDiv.style.boxShadow = '0 0 10px #00ffff, inset 0 0 10px #00ffff';
    scaleDiv.style.animation = 'glow 1.5s ease-in-out infinite alternate';
    scaleDiv.style.zIndex = '1000';

    const maxHeight = Math.max(...buildings.map(b => b.scale[1]));
    scaleDiv.innerHTML = `
      <div style="margin-bottom: 10px; font-size: 18px;">建筑高度</div>
      <div style="display: flex; align-items: center; gap: 10px;">
        <div style="width: 4px; height: 100px; background: linear-gradient(to top, #4CAF50, #FFA500, #FF0000);"></div>
        <div style="display: flex; flex-direction: column; justify-content: space-between; height: 100px;">
          <div>${Math.round(maxHeight)}m</div>
          <div>${Math.round(maxHeight/2)}m</div>
          <div>0m</div>
        </div>
      </div>
    `;

    containerRef.current.appendChild(legendDiv);
    containerRef.current.appendChild(scaleDiv);

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);
    }
    animate();

    // Handle resize
    function handleResize() {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      labelRenderer.setSize(width, height);
    }
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      containerRef.current?.removeChild(labelRenderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}
