def isPresent(n, nums, target):
    s,e = 0,n-1
    while s <= e:
        mid = (s+e)//2
        if nums[mid] == target:
            return mid
        elif nums[mid] > target:
            s = mid + 1
        else:
            e = mid - 1
    return -1