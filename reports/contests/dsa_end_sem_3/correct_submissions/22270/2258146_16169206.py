def isPresent(n, nums, target):
    l, r = 0, n - 1
    while l <= r:
        m = (l + r) // 2

        if nums[m] == target:
            return m
        
        if target > nums[m]:
            r = m - 1
        else:
            l = m + 1
    
    return -1