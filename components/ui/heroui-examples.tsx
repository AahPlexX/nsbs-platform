"use client"

import {
  Accordion,
  AccordionItem,
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  CheckboxGroup,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Progress,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  Slider,
  Spinner,
  Switch,
  Tab,
  Tabs,
  Textarea,
  useDisclosure,
} from "@heroui/react"
import { useState } from "react"

const animals = [
  { key: "cat", label: "Cat" },
  { key: "dog", label: "Dog" },
  { key: "elephant", label: "Elephant" },
  { key: "lion", label: "Lion" },
  { key: "tiger", label: "Tiger" },
  { key: "giraffe", label: "Giraffe" },
  { key: "dolphin", label: "Dolphin" },
  { key: "penguin", label: "Penguin" },
  { key: "zebra", label: "Zebra" },
  { key: "shark", label: "Shark" },
]

export function HeroUIExamples() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [isSelected, setIsSelected] = useState(false)
  const [sliderValue, setSliderValue] = useState(50)
  const [selectedValue, setSelectedValue] = useState("cat")
  const [checkboxValues, setCheckboxValues] = useState(["buenos-aires"])
  const [radioValue, setRadioValue] = useState("london")

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-evergreen-950 dark:text-evergreen-200 mb-2">
          HeroUI Components
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Comprehensive showcase of HeroUI components with NSBS branding
        </p>
      </div>

      {/* Buttons Section */}
      <Card className="w-full">
        <CardHeader>
          <h2 className="text-2xl font-semibold text-evergreen-900 dark:text-evergreen-100">
            Buttons
          </h2>
        </CardHeader>
        <CardBody>
          <div className="flex flex-wrap gap-4">
            <Button color="primary" variant="solid">
              Primary Button
            </Button>
            <Button color="secondary" variant="solid">
              Secondary Button
            </Button>
            <Button color="primary" variant="bordered">
              Bordered Button
            </Button>
            <Button color="primary" variant="flat">
              Flat Button
            </Button>
            <Button color="primary" variant="ghost">
              Ghost Button
            </Button>
            <Button color="primary" variant="light">
              Light Button
            </Button>
            <Button color="primary" size="sm">
              Small
            </Button>
            <Button color="primary" size="md">
              Medium
            </Button>
            <Button color="primary" size="lg">
              Large
            </Button>
            <Button color="primary" isLoading>
              Loading
            </Button>
            <Button color="primary" isDisabled>
              Disabled
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Cards Section */}
      <Card className="w-full">
        <CardHeader>
          <h2 className="text-2xl font-semibold text-evergreen-900 dark:text-evergreen-100">
            Cards
          </h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="max-w-[400px]">
              <CardHeader className="flex gap-3">
                <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" size="lg" />
                <div className="flex flex-col">
                  <p className="text-md font-semibold">John Doe</p>
                  <p className="text-small text-default-500">@johndoe</p>
                </div>
              </CardHeader>
              <CardBody>
                <p>Make beautiful websites regardless of your design experience.</p>
              </CardBody>
              <CardFooter>
                <Button color="primary" variant="flat" size="sm">
                  Follow
                </Button>
              </CardFooter>
            </Card>

            <Card className="max-w-[400px]">
              <CardHeader>
                <h4 className="font-bold text-large">Simple Card</h4>
              </CardHeader>
              <CardBody>
                <p>This is a simple card example with HeroUI.</p>
              </CardBody>
            </Card>

            <Card className="max-w-[400px]">
              <CardHeader>
                <h4 className="font-bold text-large">Card with Footer</h4>
              </CardHeader>
              <CardBody>
                <p>Card content goes here.</p>
              </CardBody>
              <CardFooter>
                <Button color="secondary" size="sm">
                  Action
                </Button>
              </CardFooter>
            </Card>
          </div>
        </CardBody>
      </Card>

      {/* Form Controls Section */}
      <Card className="w-full">
        <CardHeader>
          <h2 className="text-2xl font-semibold text-evergreen-900 dark:text-evergreen-100">
            Form Controls
          </h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Input type="text" label="Name" placeholder="Enter your name" variant="bordered" />
              <Input
                type="email"
                label="Email"
                placeholder="Enter your email"
                variant="underlined"
              />
              <Textarea
                label="Description"
                placeholder="Enter your description"
                variant="bordered"
              />
              <Select
                label="Favorite Animal"
                placeholder="Select an animal"
                selectedKeys={[selectedValue]}
                onSelectionChange={(keys) => setSelectedValue(Array.from(keys)[0] as string)}
              >
                {animals.map((animal) => (
                  <SelectItem key={animal.key}>{animal.label}</SelectItem>
                ))}
              </Select>
            </div>
            <div className="space-y-4">
              <Switch isSelected={isSelected} onValueChange={setIsSelected} color="primary">
                Enable notifications
              </Switch>
              <div className="space-y-2">
                <label className="text-sm font-medium">Volume: {sliderValue}</label>
                <Slider
                  size="md"
                  step={1}
                  color="primary"
                  showSteps={true}
                  maxValue={100}
                  minValue={0}
                  defaultValue={50}
                  value={sliderValue}
                  onChange={(value) => setSliderValue(value as number)}
                  className="max-w-md"
                />
              </div>
              <CheckboxGroup
                label="Select cities"
                color="primary"
                value={checkboxValues}
                onValueChange={setCheckboxValues}
              >
                <Checkbox value="buenos-aires">Buenos Aires</Checkbox>
                <Checkbox value="sydney">Sydney</Checkbox>
                <Checkbox value="san-francisco">San Francisco</Checkbox>
                <Checkbox value="london">London</Checkbox>
                <Checkbox value="tokyo">Tokyo</Checkbox>
              </CheckboxGroup>
              <RadioGroup
                label="Select your favorite city"
                color="primary"
                value={radioValue}
                onValueChange={setRadioValue}
              >
                <Radio value="buenos-aires">Buenos Aires</Radio>
                <Radio value="sydney">Sydney</Radio>
                <Radio value="san-francisco">San Francisco</Radio>
                <Radio value="london">London</Radio>
                <Radio value="tokyo">Tokyo</Radio>
              </RadioGroup>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Feedback Section */}
      <Card className="w-full">
        <CardHeader>
          <h2 className="text-2xl font-semibold text-evergreen-900 dark:text-evergreen-100">
            Feedback Components
          </h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Progress Bars</h3>
              <Progress value={65} color="primary" className="max-w-md" />
              <Progress value={30} color="secondary" className="max-w-md" />
              <Progress size="sm" isIndeterminate aria-label="Loading..." className="max-w-md" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Spinners</h3>
              <div className="flex gap-4">
                <Spinner size="sm" />
                <Spinner size="md" />
                <Spinner size="lg" />
                <Spinner color="primary" />
                <Spinner color="secondary" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Chips & Badges</h3>
              <div className="flex gap-2 flex-wrap">
                <Chip color="primary" variant="solid">
                  Primary
                </Chip>
                <Chip color="secondary" variant="solid">
                  Secondary
                </Chip>
                <Chip color="primary" variant="bordered">
                  Bordered
                </Chip>
                <Chip color="primary" variant="flat">
                  Flat
                </Chip>
                <Badge content="99+" color="primary">
                  <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" size="md" />
                </Badge>
                <Badge content="New" color="secondary" variant="flat">
                  <Button variant="bordered">Messages</Button>
                </Badge>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Navigation Section */}
      <Card className="w-full">
        <CardHeader>
          <h2 className="text-2xl font-semibold text-evergreen-900 dark:text-evergreen-100">
            Navigation Components
          </h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Tabs</h3>
              <Tabs color="primary" variant="bordered">
                <Tab key="photos" title="Photos">
                  <Card>
                    <CardBody>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                      incididunt ut labore et dolore magna aliqua.
                    </CardBody>
                  </Card>
                </Tab>
                <Tab key="music" title="Music">
                  <Card>
                    <CardBody>
                      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                      aliquip ex ea commodo consequat.
                    </CardBody>
                  </Card>
                </Tab>
                <Tab key="videos" title="Videos">
                  <Card>
                    <CardBody>
                      Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                      deserunt mollit anim id est laborum.
                    </CardBody>
                  </Card>
                </Tab>
              </Tabs>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Accordion</h3>
              <Accordion variant="bordered">
                <AccordionItem key="1" aria-label="Accordion 1" title="What is HeroUI?">
                  HeroUI is a modern React UI library that provides a set of accessible, reusable,
                  and composable React components.
                </AccordionItem>
                <AccordionItem key="2" aria-label="Accordion 2" title="How to use HeroUI?">
                  You can use HeroUI by installing it via npm and importing the components you need
                  in your React application.
                </AccordionItem>
                <AccordionItem key="3" aria-label="Accordion 3" title="Is it customizable?">
                  Yes, HeroUI is highly customizable with support for custom themes, variants, and
                  styling through Tailwind CSS.
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Interactive Components Section */}
      <Card className="w-full">
        <CardHeader>
          <h2 className="text-2xl font-semibold text-evergreen-900 dark:text-evergreen-100">
            Interactive Components
          </h2>
        </CardHeader>
        <CardBody>
          <div className="flex gap-4 flex-wrap">
            <Dropdown>
              <DropdownTrigger>
                <Button variant="bordered">Open Menu</Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions">
                <DropdownItem key="new">New file</DropdownItem>
                <DropdownItem key="copy">Copy link</DropdownItem>
                <DropdownItem key="edit">Edit file</DropdownItem>
                <DropdownItem key="delete" className="text-danger" color="danger">
                  Delete file
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>

            <Button onPress={onOpen} color="primary">
              Open Modal
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
                    <ModalBody>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar
                        risus non risus hendrerit venenatis. Pellentesque sit amet hendrerit risus,
                        sed porttitor quam.
                      </p>
                    </ModalBody>
                    <ModalFooter>
                      <Button color="danger" variant="light" onPress={onClose}>
                        Close
                      </Button>
                      <Button color="primary" onPress={onClose}>
                        Action
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
          </div>
        </CardBody>
      </Card>

      {/* Usage Examples */}
      <Card className="w-full">
        <CardHeader>
          <h2 className="text-2xl font-semibold text-evergreen-900 dark:text-evergreen-100">
            NSBS Themed Examples
          </h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-evergreen-200 dark:border-evergreen-700">
              <CardHeader className="bg-evergreen-50 dark:bg-evergreen-900">
                <h3 className="text-evergreen-900 dark:text-evergreen-100 font-semibold">
                  NSBS Application Form
                </h3>
              </CardHeader>
              <CardBody className="space-y-4">
                <Input
                  label="Business Name"
                  placeholder="Enter your business name"
                  variant="bordered"
                  color="primary"
                />
                <Select label="Business Type" placeholder="Select business type" color="primary">
                  <SelectItem key="retail">Retail</SelectItem>
                  <SelectItem key="service">Service</SelectItem>
                  <SelectItem key="manufacturing">Manufacturing</SelectItem>
                  <SelectItem key="technology">Technology</SelectItem>
                </Select>
                <Slider
                  label="Years in Business"
                  color="primary"
                  maxValue={50}
                  minValue={0}
                  defaultValue={5}
                  className="max-w-md"
                />
              </CardBody>
              <CardFooter>
                <Button color="primary" className="w-full">
                  Submit Application
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-mint-sage-200 dark:border-mint-sage-700">
              <CardHeader className="bg-mint-sage-50 dark:bg-mint-sage-900">
                <h3 className="text-mint-sage-900 dark:text-mint-sage-100 font-semibold">
                  Membership Status
                </h3>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar src="https://i.pravatar.cc/150?u=member1" size="lg" />
                    <div>
                      <h4 className="font-semibold">Active Member</h4>
                      <p className="text-small text-default-500">Since January 2023</p>
                    </div>
                    <Chip color="success" variant="flat">
                      Active
                    </Chip>
                  </div>
                  <Progress label="Membership Benefits Used" value={75} color="secondary" />
                  <div className="flex gap-2">
                    <Button color="secondary" size="sm" variant="flat">
                      View Benefits
                    </Button>
                    <Button color="secondary" size="sm" variant="bordered">
                      Renew Membership
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

export default HeroUIExamples
