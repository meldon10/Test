package com.sap.acs.constant;

public enum Priority {

    NORMAL("1"), MEDIUM("2"), HIGH("3");

    private String value;

    private Priority(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static String getKeyFromValue(String value) {
        for (Priority constant : Priority.values()) {
            if (constant.getValue().equals(value))
                return constant.toString();

        }
        return null;
    }

    public static String getValueFromKey(String value) {
        for (Priority constant : Priority.values()) {
            if (constant.name().equals(value))
                return constant.getValue();

        }
        return null;
    }

}
