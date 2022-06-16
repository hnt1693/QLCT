package com.nta.teabreakorder.service.impl;

import com.pusher.rest.Pusher;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class PusherService {


    private static Pusher pusher;
    private final String CHANNEL_NAME = "TEABREAK_ORDER";
    public static final String ORDERS = "ORDERS";
    public static final String ADD_ORDER = "ADD_ORDER";
    public static final String EDIT_ORDER = "EDIT_ORDER";
    public static final String EDIT_ORDERS = "EDIT_ORDERS";
    public static final String REMOVE_ORDER = "REMOVE_ORDER";

    static {
        pusher = new Pusher("1406839", "94e4ab3f1c94d7d3828f", "9f93694957639be2cdad");
        pusher.setCluster("ap1");
        pusher.setEncrypted(true);
    }

    public void triggerEvent(String eventName, Object data) {
        pusher.trigger(CHANNEL_NAME, eventName, data);
    }

}
