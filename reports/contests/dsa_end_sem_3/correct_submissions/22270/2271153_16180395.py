def isPresent(n, nums, target):
    #write your code here
    start = 0
    end = n-1
    ans = -1
    while start<=end:
        mid = (start+end)//2

        # print(start,mid,end)
        if nums[mid]==target:
            ans = mid
            break
        elif nums[mid]<target:
            end = mid-1
        else:
            start = mid+1
    return ans