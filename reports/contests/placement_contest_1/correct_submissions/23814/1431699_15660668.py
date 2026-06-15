def firstOccurrence(nums):
    n = len(nums)
    i = 0
    j = n-1
    ans = -1
    key = 1
    while i<=j:
        m = (j+i)//2
        if nums[m] == key:
            ans = m
            j = m-1
        if nums[m]>key:
            i = m+1
        else:
            j = m - 1
    return ans