export const PARTS = ['Engine', 'Drivetrain', 'Wheels', 'Fuel Tank']

export const CAMERA_PRESETS = {
  Engine: {
    target: '0m 0.22m 0m',
    orbit: '20deg 74deg 2.2m',
    summary: 'Baseline framing centers the chassis and keeps the wheel contact line low.',
  },
  Drivetrain: {
    target: '0m 0.16m -0.18m',
    orbit: '152deg 79deg 2m',
    summary: 'Drivetrain view stays centered while biasing toward the tunnel and gearbox.',
  },
  Wheels: {
    target: '0.74m 0.08m 0.88m',
    orbit: '28deg 80deg 1.45m',
    summary: 'Wheel focus drops lower to align the tire contact patch close to the floor.',
  },
  'Fuel Tank': {
    target: '0m 0.08m -1.02m',
    orbit: '200deg 82deg 1.7m',
    summary: 'Rear framing stays level with the underbody so the vehicle still feels grounded.',
  },
}

export const CURRICULUM = {
  Engine: [
    {
      title: 'Internal Combustion Engine Architecture',
      body:
        'Internal combustion systems convert the chemical energy of fuel into crankshaft torque through controlled combustion, piston motion, and a reciprocating valvetrain.',
      bullets: [
        'Core subsystems include the cylinder block, pistons, crankshaft, valvetrain, lubrication loop, intake, exhaust, and cooling network.',
        'Automotive engineering analysis focuses on brake thermal efficiency, emissions formation, torque curves, transient response, and packaging constraints.',
        'This architecture remains relevant for fuel economy optimization, aftertreatment integration, and durability engineering.',
      ],
    },
    {
      title: 'Battery Electric Drive Architecture',
      body:
        'Battery electric vehicles replace combustion with high-voltage energy storage, power electronics, and one or more electric traction motors to deliver wheel torque.',
      bullets: [
        'The main architecture includes the battery pack, inverter, motor, reduction gear, thermal management system, and onboard charging hardware.',
        'Engineering study emphasizes energy density, regenerative braking, thermal control, inverter switching efficiency, and vehicle range under load.',
        'EV packaging changes the chassis by shifting mass distribution and reducing the number of moving propulsion components.',
      ],
    },
    {
      title: 'Hybrid Powertrain Architecture',
      body:
        'Hybrid systems combine an internal combustion engine with an electric machine and battery storage to balance efficiency, drivability, and emissions performance.',
      bullets: [
        'Common layouts include series, parallel, and power-split architectures, each with different mechanical and control-system tradeoffs.',
        'Engineers examine supervisory control logic, torque blending, regenerative energy capture, battery sizing, and transmission integration.',
        'Hybrid design is a systems-engineering exercise where mechanical, electrical, and software domains must operate as one coordinated powertrain.',
      ],
    },
  ],
  Drivetrain: [
    {
      title: 'Torque Delivery Path',
      body:
        'The drivetrain transfers propulsion output from the power source to the driven wheels through gearing, shafts, and differential action.',
      bullets: [
        'Key study areas include gear ratio selection, driveline losses, NVH behavior, and torque distribution under dynamic load.',
        'Layout decisions influence acceleration, efficiency, serviceability, and packaging inside the chassis.',
      ],
    },
    {
      title: 'Transmission and Final Drive',
      body:
        'Transmission assemblies adapt motor or engine speed to wheel demand, while the final drive sets the last stage of torque multiplication.',
      bullets: [
        'Mechanical design focuses on tooth geometry, lubrication, bearing support, and thermal durability.',
        'Control integration affects shift quality, traction, and launch behavior.',
      ],
    },
  ],
  Wheels: [
    {
      title: 'Wheel-End Assembly',
      body:
        'Wheel systems interface the vehicle with the road through the tire, hub, brake, and suspension attachment points.',
      bullets: [
        'Engineering metrics include contact patch behavior, unsprung mass, rotational inertia, and brake cooling airflow.',
        'Material and geometry choices directly affect grip, response, and durability.',
      ],
    },
    {
      title: 'Tire Dynamics',
      body:
        'Tires convert vertical load and slip into longitudinal and lateral forces that determine traction, braking, and steering response.',
      bullets: [
        'Students typically study slip angle, temperature sensitivity, wear, and the effects of pressure on handling.',
        'Wheel packaging also influences clearance, steering lock, and suspension travel.',
      ],
    },
  ],
  'Fuel Tank': [
    {
      title: 'Fuel Storage and Packaging',
      body:
        'The fuel tank module stores liquid fuel safely while fitting within crash structures, exhaust routing, and rear chassis geometry.',
      bullets: [
        'Design work considers slosh control, venting, filler path packaging, and regulatory safety requirements.',
        'Material selection and shield design affect durability and thermal protection.',
      ],
    },
    {
      title: 'System Integration',
      body:
        'Fuel delivery depends on a coordinated tank, pump, sender, lines, and vapor-management system.',
      bullets: [
        'Engineers evaluate pressure stability, emissions containment, and service access across the vehicle lifecycle.',
        'Packaging analysis is critical because the tank shares space with suspension, body structure, and luggage volume.',
      ],
    },
  ],
}

export const LESSON_INTERACTIONS = {
  Engine: [
    {
      simple: 'An engine is the car part that creates the force needed to make the car move.',
      explainer:
        'Fuel burns in a controlled way, pushes the pistons, and turns the crankshaft. That spinning motion is what powers the car forward.',
      hotspots: [
        {
          label: 'Fuel in',
          detail: 'The engine mixes fuel and air so it has energy to work with.',
        },
        {
          label: 'Push',
          detail: 'Combustion pushes the pistons up and down like tiny pumps.',
        },
        {
          label: 'Spin',
          detail: 'The crankshaft changes that up-and-down motion into spinning motion.',
        },
      ],
      question: 'What is the engine mainly doing?',
      answer: 'It turns fuel energy into mechanical motion that can move the car.',
    },
    {
      simple: 'An electric drive system moves the car using electricity instead of burning fuel.',
      explainer:
        'The battery stores energy, the inverter controls it, and the motor turns that energy into wheel movement.',
      hotspots: [
        {
          label: 'Battery',
          detail: 'Stores electrical energy for the car to use.',
        },
        {
          label: 'Inverter',
          detail: 'Controls how electricity flows from the battery to the motor.',
        },
        {
          label: 'Motor',
          detail: 'Uses electricity to create spinning force.',
        },
      ],
      question: 'What replaces combustion in an EV?',
      answer: 'A battery, electronics, and an electric motor replace fuel burning.',
    },
    {
      simple: 'A hybrid uses both a gas engine and an electric motor to balance power and efficiency.',
      explainer:
        'The car can switch or blend between two power sources so it saves fuel while still feeling responsive.',
      hotspots: [
        {
          label: 'Two systems',
          detail: 'A hybrid carries both an engine and an electric drive setup.',
        },
        {
          label: 'Smart control',
          detail: 'Software decides when each system should help.',
        },
        {
          label: 'Better efficiency',
          detail: 'The motor can help during low-speed driving or recover energy while braking.',
        },
      ],
      question: 'Why are hybrids useful?',
      answer: 'They combine engine power with electric efficiency to use less fuel.',
    },
  ],
  Drivetrain: [
    {
      simple: 'The drivetrain is the path that carries power from the engine or motor to the wheels.',
      explainer:
        'Even if the car makes power, it still needs gears, shafts, and joints to deliver that power to the road.',
      hotspots: [
        {
          label: 'Transfer',
          detail: 'The drivetrain passes power along the car.',
        },
        {
          label: 'Control',
          detail: 'It helps manage how much turning force reaches the wheels.',
        },
        {
          label: 'Traction',
          detail: 'Good drivetrain design helps the car grip and move smoothly.',
        },
      ],
      question: 'What happens if a car has power but no drivetrain?',
      answer: 'The power would not reach the wheels, so the car would not move properly.',
    },
    {
      simple: 'The transmission changes gear ratios so the car can handle different speeds and loads.',
      explainer:
        'Low gears help the car start moving with more force, while higher gears help it cruise efficiently.',
      hotspots: [
        {
          label: 'Low gear',
          detail: 'Gives more force for starting and climbing.',
        },
        {
          label: 'High gear',
          detail: 'Helps the car travel faster with less strain.',
        },
        {
          label: 'Final drive',
          detail: 'Adds one more stage of force multiplication before the wheels turn.',
        },
      ],
      question: 'Why not use one single gear all the time?',
      answer: 'Different driving situations need different balances of force and speed.',
    },
  ],
  Wheels: [
    {
      simple: 'The wheel assembly is where the car finally meets the road.',
      explainer:
        'The wheel, tire, brake, and hub work together so the car can roll, stop, and stay stable.',
      hotspots: [
        {
          label: 'Tire grip',
          detail: 'The tire touches the road and creates traction.',
        },
        {
          label: 'Brake force',
          detail: 'The brake slows the wheel down when needed.',
        },
        {
          label: 'Support',
          detail: 'The hub and suspension help keep the wheel aligned and secure.',
        },
      ],
      question: 'Why is the wheel end so important?',
      answer: 'It controls the contact between the vehicle and the road.',
    },
    {
      simple: 'Tires create the grip that lets a car steer, accelerate, and brake safely.',
      explainer:
        'A tire may look simple, but its pressure, heat, and shape all change how well the car handles.',
      hotspots: [
        {
          label: 'Steering',
          detail: 'Tires help the car change direction.',
        },
        {
          label: 'Braking',
          detail: 'They create friction needed to slow down.',
        },
        {
          label: 'Pressure',
          detail: 'Wrong pressure can reduce grip and wear the tire faster.',
        },
      ],
      question: 'What gives a tire its real job in a car?',
      answer: 'Its ability to create grip with the road.',
    },
  ],
  'Fuel Tank': [
    {
      simple: 'The fuel tank safely stores fuel until the engine needs it.',
      explainer:
        'It has to fit inside the car, stay protected in a crash, and keep fuel from leaking or overheating.',
      hotspots: [
        {
          label: 'Storage',
          detail: 'The tank keeps fuel contained and ready to use.',
        },
        {
          label: 'Safety',
          detail: 'Its position and shape help protect it during impacts.',
        },
        {
          label: 'Venting',
          detail: 'The system manages fumes so pressure does not build up dangerously.',
        },
      ],
      question: 'Why is tank design about more than just holding fuel?',
      answer: 'Because it also has to manage safety, space, and fuel vapors.',
    },
    {
      simple: 'The fuel system works as a team to move fuel from the tank to the engine.',
      explainer:
        'The pump, lines, and sensors all need to work together so the engine gets fuel at the right time and pressure.',
      hotspots: [
        {
          label: 'Pump',
          detail: 'Pushes fuel out of the tank.',
        },
        {
          label: 'Lines',
          detail: 'Carry fuel toward the engine.',
        },
        {
          label: 'Control',
          detail: 'Sensors help the system stay safe and consistent.',
        },
      ],
      question: 'What is the main goal of system integration here?',
      answer: 'To deliver fuel safely and reliably from storage to the engine.',
    },
  ],
}
