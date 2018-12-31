var b2dExample1 = {
  "objs": [
    {
      "id": 0,
      "type": "beam",
      "x1": 0,
      "y1": 0,
      "x2": 1.9,
      "y2": 0
    },
    {
      "id": 1,
      "type": "support",
      "support_type": "support_fixed",
      "x": 1.9,
      "y": 0,
      "dir": "dir_x_minus"
    },
    {
      "id": 2,
      "type": "load",
      "load_type": "load_force",
      "x1": 0,
      "y1": 0,
      "x2": 0,
      "y2": 0,
      "c_x1": 3473.2918522949863,
      "c_y1": -3596.6990016932555,
      "c_x2": 0,
      "c_y2": 0
    }
  ],
  "I": 0.00000573,
  "E": 210000000000,
  "dx": 0.001
};

var b2dExample2 = {
  "objs": [
    {
      "id": 5,
      "type": "beam",
      "x1": 0,
      "y1": 0,
      "x2": 1.7,
      "y2": 0
    },
    {
      "id": 6,
      "type": "beam",
      "x1": 1.7,
      "y1": 0,
      "x2": 5,
      "y2": 0
    },
    {
      "id": 7,
      "type": "beam",
      "x1": 5,
      "y1": 0,
      "x2": 6.2,
      "y2": 0
    },
    {
      "id": 8,
      "type": "support",
      "support_type": "support_wrist",
      "x": 0,
      "y": 0,
      "dir": "dir_y_plus"
    },
    {
      "id": 9,
      "type": "support",
      "support_type": "support_trundle",
      "x": 5,
      "y": 0,
      "dir": "dir_y_plus"
    },
    {
      "id": 10,
      "type": "load",
      "load_type": "load_moment",
      "x1": 1.7,
      "y1": 0,
      "x2": 0,
      "y2": 0,
      "c_x1": -4530,
      "c_y1": 0,
      "c_x2": 0,
      "c_y2": 0
    },
    {
      "id": 11,
      "type": "load",
      "load_type": "load_force",
      "x1": 6.2,
      "y1": 0,
      "x2": 0,
      "y2": 0,
      "c_x1": -2414.2972266850666,
      "c_y1": 2777.3312552198013,
      "c_x2": 0,
      "c_y2": 0
    }
  ],
  "I": 0.00000171,
  "E": 210000000000,
  "dx": 0.001
};

var b2dExample3 = {
  "objs": [
    {
      "id": 0,
      "type": "beam",
      "x1": 0,
      "y1": 0,
      "x2": 1.2,
      "y2": 0
    },
    {
      "id": 1,
      "type": "beam",
      "x1": 1.2,
      "y1": 0,
      "x2": 1.8,
      "y2": 0
    },
    {
      "id": 2,
      "type": "support",
      "support_type": "support_fixed",
      "x": 1.8,
      "y": 0,
      "dir": "dir_x_minus"
    },
    {
      "id": 3,
      "type": "load",
      "load_type": "load_force",
      "x1": 0,
      "y1": 0,
      "x2": 0,
      "y2": 0,
      "c_x1": 3581.44231343778,
      "c_y1": 2415.7133429936266,
      "c_x2": 0,
      "c_y2": 0
    },
    {
      "id": 4,
      "type": "load",
      "load_type": "load_dist_const",
      "x1": 1.2,
      "y1": 0,
      "x2": 1.8,
      "y2": 0,
      "c_x1": -3.416764569621115e-13,
      "c_y1": -1860,
      "c_x2": -3.416764569621115e-13,
      "c_y2": -1860
    }
  ],
  "I": 0.00000171,
  "E": 210000000000,
  "dx": 0.0005
};

var b2dExample4 = {
    "objs": [
    {
      "id": 5,
      "type": "beam",
      "x1": 0,
      "y1": 0,
      "x2": 2,
      "y2": 0
    },
    {
      "id": 6,
      "type": "beam",
      "x1": 2,
      "y1": 0,
      "x2": 4.3,
      "y2": 0
    },
    {
      "id": 7,
      "type": "beam",
      "x1": 4.3,
      "y1": 0,
      "x2": 7.6,
      "y2": 0
    },
    {
      "id": 8,
      "type": "support",
      "support_type": "support_wrist",
      "x": 0,
      "y": 0,
      "dir": "dir_y_plus"
    },
    {
      "id": 9,
      "type": "support",
      "support_type": "support_trundle",
      "x": 4.3,
      "y": 0,
      "dir": "dir_y_plus"
    },
    {
      "id": 10,
      "type": "support",
      "support_type": "support_trundle",
      "x": 7.6,
      "y": 0,
      "dir": "dir_y_plus"
    },
    {
      "id": 11,
      "type": "load",
      "load_type": "load_force",
      "x1": 2,
      "y1": 0,
      "x2": 0,
      "y2": 0,
      "c_x1": 0,
      "c_y1": -17600,
      "c_x2": 0,
      "c_y2": 0
    }
  ],
  "I": 0.0000145,
  "E": 210000000000,
  "dx": 0.0005
};

var b2dExample5 = {
  "objs": [
    {
      "id": 0,
      "type": "beam",
      "x1": 0,
      "y1": 0,
      "x2": 1.5,
      "y2": 0
    },
    {
      "id": 1,
      "type": "beam",
      "x1": 1.5,
      "y1": 0,
      "x2": 3,
      "y2": 0
    },
    {
      "id": 2,
      "type": "beam",
      "x1": 3,
      "y1": 0,
      "x2": 4.5,
      "y2": 0
    },
    {
      "id": 3,
      "type": "beam",
      "x1": 4.5,
      "y1": 0,
      "x2": 7.5,
      "y2": 0
    },
    {
      "id": 4,
      "type": "beam",
      "x1": 7.5,
      "y1": 0,
      "x2": 9,
      "y2": 0
    },
    {
      "id": 5,
      "type": "support",
      "support_type": "support_wrist",
      "x": 1.5,
      "y": 0,
      "dir": "dir_y_plus"
    },
    {
      "id": 6,
      "type": "support",
      "support_type": "support_joint",
      "x": 3,
      "y": 0,
      "dir": "dir_y_plus"
    },
    {
      "id": 7,
      "type": "support",
      "support_type": "support_trundle",
      "x": 4.5,
      "y": 0,
      "dir": "dir_y_plus"
    },
    {
      "id": 8,
      "type": "support",
      "support_type": "support_trundle",
      "x": 7.5,
      "y": 0,
      "dir": "dir_y_plus"
    },
    {
      "id": 9,
      "type": "load",
      "load_type": "load_dist_const",
      "x1": 0,
      "y1": 0,
      "x2": 9,
      "y2": 0,
      "c_x1": 2.755455298081545e-13,
      "c_y1": 4500,
      "c_x2": 2.755455298081545e-13,
      "c_y2": 4500
    }
  ],
  "I": 0.000328,
  "E": 210000000000,
  "dx": 0.001
};
