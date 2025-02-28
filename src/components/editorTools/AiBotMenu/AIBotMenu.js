"use client";
import { faCheckCircle, faMagic, faRobot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, DropdownMenu } from "@radix-ui/themes";

const AIBotMenu = ({ onCorrect, onEnhance, onOpenAssistant }) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button variant="soft" size="3">
          IA
          <DropdownMenu.TriggerIcon />
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content className="menu-content">
        <DropdownMenu.Item className="menu-item" onClick={onCorrect}>
          <FontAwesomeIcon icon={faCheckCircle} className="menu-icon" />
          Corriger avec l&apos;IA
        </DropdownMenu.Item>
        <DropdownMenu.Item className="menu-item" onClick={onEnhance}>
          <FontAwesomeIcon icon={faMagic} className="menu-icon" />
          Améliorer avec l&apos;IA
        </DropdownMenu.Item>
        <DropdownMenu.Item className="menu-item" onClick={onOpenAssistant}>
          <FontAwesomeIcon icon={faRobot} className="menu-icon" />
          Ouvrir l&apos;assistant IA
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default AIBotMenu;
