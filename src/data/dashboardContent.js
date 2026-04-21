export const EDUCATIONAL_CONTENT = {
  Engine: {
    slug: 'engine',
    category: 'Powertrain',
    label: 'Engine',
    kicker: 'Combustion Lesson',
    summary: 'The engine is the force-maker that starts the whole motion story.',
    hotspotPosition: [-0.323, -0.015, 0.027],
    cameraPosition: [-0.323, 0.5, 2.0],
    slides: [
      {
        eyebrow: 'What Is It?',
        title: 'The car’s power source',
        body:
          'The engine turns fuel into spinning force. That force is what eventually moves the car down the road.',
        accent: 'Think of it as the part that wakes the whole vehicle up.',
      },
      {
        eyebrow: 'Step 1',
        title: 'Air and fuel enter',
        body:
          'The engine pulls in air and combines it with fuel so it has a high-energy mixture ready to use.',
        accent: 'No air means no burn. No fuel means no power.',
      },
      {
        eyebrow: 'Step 2',
        title: 'Combustion pushes the pistons',
        body:
          'Inside the cylinders, the mixture ignites. That tiny explosion pushes the pistons and creates force.',
        accent: 'This is where chemical energy becomes mechanical movement.',
      },
      {
        eyebrow: 'Step 3',
        title: 'Up-and-down becomes spin',
        body:
          'The crankshaft transforms piston motion into rotation. That spinning motion is what the rest of the car can actually use.',
        accent: 'The engine does not push the wheels directly. It sends out rotation.',
      },
    ],
  },
  Brakes: {
    slug: 'brakes',
    category: 'Safety System',
    label: 'Brakes',
    kicker: 'Stopping Lesson',
    summary: 'The brakes turn motion into heat so the driver can stay in control.',
    hotspotPosition: [-1.2, 0.48, 1.52],
    cameraPosition: [-2.5, 1.05, 2.7],
    slides: [
      {
        eyebrow: 'What Is It?',
        title: 'The car’s stopping system',
        body:
          'The brakes are the system that slows the wheels using friction. They help the car reduce speed, stop, and stay safe.',
        accent: 'A fast car is only useful if the driver can control when it stops.',
      },
      {
        eyebrow: 'Step 1',
        title: 'The pedal sends the command',
        body:
          'When the driver presses the brake pedal, the car converts that foot pressure into hydraulic pressure.',
        accent: 'The brake system is really a force-delivery system.',
      },
      {
        eyebrow: 'Step 2',
        title: 'Fluid carries the force',
        body:
          'Brake fluid travels through sealed lines and delivers that pressure to the wheel brakes almost instantly.',
        accent: 'Fluid lets the same push reach multiple wheels at once.',
      },
      {
        eyebrow: 'Step 3',
        title: 'Pads grip the rotor',
        body:
          'The brake pads clamp onto a spinning rotor. Friction resists motion and the car’s kinetic energy turns into heat.',
        accent: 'Braking is energy conversion, not energy disappearance.',
      },
    ],
  },
  Drivetrain: {
    slug: 'drivetrain',
    category: 'Power Delivery',
    label: 'Drivetrain',
    kicker: 'Motion Transfer Lesson',
    summary: 'The drivetrain carries engine power from the car to the wheels.',
    hotspotPosition: [0.55, 1.15, 1.22],
    cameraPosition: [2.05, 2.25, 2.85],
    slides: [
      {
        eyebrow: 'What Is It?',
        title: 'The car’s power path',
        body:
          'The drivetrain is the group of parts that takes rotation from the engine and sends it to the wheels.',
        accent: 'Power is only useful if the car can transfer it to the road.',
      },
      {
        eyebrow: 'Step 1',
        title: 'Power leaves the engine',
        body:
          'After the engine creates rotation, that spinning force moves into the transmission and the rest of the drivetrain.',
        accent: 'The drivetrain begins where engine output needs to be managed and delivered.',
      },
      {
        eyebrow: 'Step 2',
        title: 'Gears shape the force',
        body:
          'The transmission and connected gears adjust speed and torque so the car can handle starting, climbing, and cruising.',
        accent: 'Different situations need different balances of force and speed.',
      },
      {
        eyebrow: 'Step 3',
        title: 'The wheels receive the motion',
        body:
          'Driveshafts, axles, and related parts carry that rotation outward until the wheels can push against the road.',
        accent: 'This is the final link between engine power and vehicle movement.',
      },
    ],
  },
}

export const PARTS = Object.keys(EDUCATIONAL_CONTENT)

const partQueryEntries = PARTS.flatMap((part) => {
  const slug = EDUCATIONAL_CONTENT[part].slug

  return [
    [part.toLowerCase(), part],
    [slug.toLowerCase(), part],
    [part.replaceAll(' ', '-').toLowerCase(), part],
    [part.replaceAll(' ', '').toLowerCase(), part],
  ]
})

export const PART_QUERY_LOOKUP = Object.fromEntries(partQueryEntries)

export function resolvePartSelection(value) {
  if (typeof value !== 'string') {
    return null
  }

  return PART_QUERY_LOOKUP[value.trim().toLowerCase()] ?? null
}
