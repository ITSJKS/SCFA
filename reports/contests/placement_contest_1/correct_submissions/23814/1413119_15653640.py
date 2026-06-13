def firstOccurrence(nums):
    l = 0
    h = len(nums) - 1
    flag = 0
    while l <= h:
        m = (l + h) // 2
        # print(l , m , h)
        if nums[m] == 1:
            flag = 1
            h = m - 1
        # elif nums[m]
        else:
            l = m + 1
            # flag = 0
    # print(flag , l , m , h)
    return l if flag else -1