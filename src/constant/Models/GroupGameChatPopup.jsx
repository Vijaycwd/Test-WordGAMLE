import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import GroupGameChat from "../../pages/GroupLeaderboard/GroupGameChat";

function GroupGameChatPopup({ groupId, gameName, createdAt, userId }) {
  const [show, setShow] = useState(false);

  return (
    <>
      {/* Button to open chat */}
      <Button className={`${gameName}-btn`} onClick={() => setShow(true)}>
        Group Messages
      </Button>

      {/* Popup Modal */}
      <Modal 
        show={show} 
        onHide={() => setShow(false)} 
        size="lg" 
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{gameName} Group Messages</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <GroupGameChat
            groupId={groupId}
            gameName={gameName}
            createdAt={createdAt}
            userId={userId}
          />
        </Modal.Body>
      </Modal>
    </>
  );
}

export default GroupGameChatPopup;
