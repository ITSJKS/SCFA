def isPresent(n, nums, target):
    ans = -1
    start = 0
    end = n -1
    while start<=end:
        mid = (start+end)//2
        if nums[mid] == target:
            ans = mid
            break
        if nums[mid]<target:
            end = mid-1
        else:
            start = mid+1
    return ans