def isPresent(n, nums, target):
    s = 0
    e = len(nums)-1
    while s<=e:
        m = (s+e)//2
        if nums[m]==target:
            return m
        elif target<nums[m]:
            s = m+1
        elif target>nums[m]:
            e = m-1
    return -1