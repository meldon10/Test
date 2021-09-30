package com.sap.acs.constant;

public enum Status {

    OPEN("1"), INPROGRESS("2"), COMPLETED("3");

    private String value;

    private Status(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static String getKeyFromValue(String value) {
        for (Status constant : Status.values()) {
            if (constant.getValue().equals(value))
                return constant.toString();

        }
        return null;
    }

    public static String getValueFromKey(String value) {
        for (Status constant : Status.values()) {
            if (constant.name().equals(value))
                return constant.getValue();

        }
        return null;
    }

}
